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

                        window.addEventListener('resize', scope.onWindowResize, false);

                        //enter animation loop
                        scope.vm.animate();
                    };

                    scope.onWindowResize = function () {
                        scope.vm.cameraService.camera.aspect = scope.width() / scope.height();
                        scope.vm.cameraService.camera.updateProjectionMatrix();
                        scope.vm.rendererService.renderer.setSize(scope.width(), scope.height());
                    };

                    scope.init();
                }
            }
        }
    });

function sceneController($scope, $rootScope, glSceneService, glCameraService, glRendererService, glConstantsService) {
    var vm = this;

    vm.constants = glConstantsService;
    vm.sceneService = glSceneService;
    vm.cameraService = glCameraService;
    vm.rendererService = glRendererService;

    vm.clock = new THREE.Clock();

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
    };

    vm.render = function () {
        //console.log('rendering...');
        vm.broadcastEvent('render');
        vm.rendererService.renderer.render(vm.sceneService.scene, vm.cameraService.camera);
    };

    vm.broadcastEvent = function (event, message) {
        $rootScope.$broadcast(event, message);
    };

}