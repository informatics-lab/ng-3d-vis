'use strict';

angular.module('three')
    .directive('glScene', function () {
        return {
            restrict: 'E',
            scope: {
                hide: '=',
                width: '=',
                height: '='
            },
            controller: sceneController,
            controllerAs: 'vm',
            link: {
                pre: function scenePreLink(scope, element, attrs) {
                    //get element
                    scope.vm.container = element[0];

                    //init scene
                    scope.vm.sceneService.scene = new THREE.Scene();

                    //init camera
                    var fov = 45;
                    var aspect = scope.width() / scope.height();
                    var near = 0.01;
                    var far = 10000;

                    scope.vm.cameraService.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
                    scope.vm.cameraService.camera.position.z = 300;
                    scope.vm.cameraService.camera.lookAt(new THREE.Vector3(0, 0, 0));
                    scope.vm.cameraService.cameraNormal = new THREE.Vector3(0,0,-1);

                    //init clock
                    scope.vm.clock = new THREE.Clock();

                    //init renderer
                    scope.vm.renderer = new THREE.WebGLRenderer({antialias: true});

                    if (!scope.hide) {
                        scope.vm.renderer.setSize(scope.width(), scope.height());
                        scope.vm.renderer.setClearColor(0x2222ee);
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
                        scope.vm.cameraService.camera.aspect = scope.width() / scope.height();
                        scope.vm.cameraService.camera.updateProjectionMatrix();
                        scope.vm.renderer.setSize(scope.width(), scope.height());
                    };

                    scope.init();
                }
            }
        }
    });

function sceneController($scope, $rootScope, glSceneService, glCameraService, glConstantsService) {
    var vm = this;

    vm.constants = glConstantsService;
    vm.sceneService = glSceneService;
    vm.cameraService = glCameraService;

    vm.animate = function () {

        var interval = 1 / vm.constants.FPS;

        var delta = vm.clock.getElapsedTime();

        if (delta > interval) {
            vm.clock.elapsedTime = 0;

            //Code for Drawing the Frame ...
            vm.render();
            vm.update();
        }

        requestAnimationFrame(vm.animate);

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

    vm.broadcastEvent = function (event, message) {
        $rootScope.$broadcast(event, message);
    };

}