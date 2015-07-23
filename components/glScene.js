'use strict';

angular.module('three')
    .directive('glScene', function () {
        return {
            restrict: 'E',
            scope: {
                hide: '='
            },
            controller: sceneController,
            controllerAs: 'vm',
            link: {
                pre: function scenePreLink(scope, element, attrs) {
                    scope.vm.container = element[0];

                    scope.vm.sceneService.scene = new THREE.Scene();

                    var fov = 45;
                    var aspect = scope.vm.width() / scope.vm.height();
                    var near = 0.01;
                    var far = 10000;

                    scope.vm.cameraService.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
                    scope.vm.cameraService.camera.position.z = 1800;
                    scope.vm.cameraService.camera.lookAt(new THREE.Vector3(0, 0, 0));

                    scope.vm.clock = new THREE.Clock();

                    scope.vm.renderer = new THREE.WebGLRenderer({antialias: true});

                    if (!scope.hide) {
                        scope.vm.renderer.setSize(scope.vm.width(), scope.vm.height());
                        scope.vm.renderer.setClearColor(0x2222ee);
                        // scope.vm.renderer.autoClear = false;
                        scope.vm.container.appendChild(scope.vm.renderer.domElement);
                    }

                },
                post: function scenePostLink(scope, element, attrs) {

                    scope.init = function () {

                        window.addEventListener('resize', scope.onWindowResize, false);

                        //enter animation loop
                        scope.vm.animate();
                    };

                    scope.onWindowResize = function () {
                        scope.vm.cameraService.camera.aspect = scope.vm.width() / scope.vm.height();
                        scope.vm.cameraService.camera.updateProjectionMatrix();
                        scope.vm.renderer.setSize(scope.vm.width(), scope.vm.height());
                    };

                    scope.init();
                }
            }
        }
    });

function sceneController($scope, $rootScope, glSceneService, glCameraService) {
    var vm = this;

    vm.sceneService = glSceneService;
    vm.cameraService = glCameraService;

    vm.animate = function () {

        var fps = 30;
        var interval = 1 / fps;

        requestAnimationFrame(vm.animate);

        if (vm.clock.getElapsedTime() > interval) {

            vm.clock.elapsedTime = 0;

            //Code for Drawing the Frame ...
            vm.render();
            vm.update();
        }

    };

    vm.update = function () {
        //console.log("updating...");

        vm.broadcastEvent('update');
        var delta = vm.clock.getDelta();
    };

    vm.render = function () {
        //console.log('rendering...');

        vm.broadcastEvent('render');
        vm.renderer.render(vm.sceneService.scene, vm.cameraService.camera);
    };

    vm.broadcastEvent = function (event) {
        $rootScope.$broadcast(event);
    };

    //gets the total width of the window
    vm.width = function () {
        return window.innerWidth;
    };

    //gets the total height of the window
    vm.height = function () {
        return window.innerHeight;
    };
}