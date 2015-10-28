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

                    if (!scope.hide) {
                        scope.vm.container.appendChild(scope.vm.rendererService.renderer.domElement);
                    }

                },
                post: function scenePostLink(scope, element, attrs) {

                    scope.init = function () {
                        //element.css('width', scope.width());

                        window.addEventListener('resize', scope.onWindowResize, false);

                        //enter animation loop
                        scope.vm.animate();
                    };

                    scope.onWindowResize = function () {
                        scope.vm.cameraService.camera.aspect = scope.width() / scope.height();
                        scope.vm.cameraService.camera.updateProjectionMatrix();
                        scope.vm.rendererService.renderer.setSize(scope.width(), scope.height());
                    };

                    scope.$on('init scene', function() {
                        console.log("initiating scene");
                        scope.init();
                    });
                }
            }
        }
    });

function sceneController($scope, $rootScope, glSceneService, glCameraService, glRendererService, glConstantsService, glVideoService) {
    var vm = this;

    vm.constants = glConstantsService;
    vm.sceneService = glSceneService;
    vm.cameraService = glCameraService;
    vm.rendererService = glRendererService;
    vm.videoService = glVideoService;

    vm.clock = new THREE.Clock();

    vm.animate = function () {

        var interval = 1 / vm.constants.FPS;

        var delta = vm.clock.getElapsedTime();

        if (delta > interval) {
            vm.clock.elapsedTime = 0;

            //Code for Drawing the Frame ...
            vm.render(delta);
            vm.update(delta);
        }

        requestAnimationFrame(vm.animate);

    };

    vm.update = function (delta) {
        //console.log("updating...");
        $rootScope.$broadcast('update', {delta: delta});
    };

    vm.render = function (delta) {
        //console.log('rendering...');
        $rootScope.$broadcast('render', {delta: delta});
        vm.rendererService.renderer.render(vm.sceneService.scene, vm.cameraService.camera);
        vm.rendererService.renderer.clearDepth(); // optional, depending on use case
        if(vm.sceneService.scene2) {
            vm.rendererService.renderer.render(vm.sceneService.scene2, vm.cameraService.camera);
        }
        vm.cameraService.cameraNormal.set(0, 0, -1);
        vm.cameraService.cameraNormal.applyQuaternion(vm.cameraService.camera.quaternion);
    };
}
