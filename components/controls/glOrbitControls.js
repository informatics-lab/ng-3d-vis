'use strict';

angular.module('three')
    .directive('glOrbitControls', ['glCameraService','glRendererService', function (glCameraService, glRendererService) {
        return {
            restrict: 'A',
            require: '^glScene',
            link: function (scope, element, attrs) {

                var controls = new THREE.OrbitControls(glCameraService.camera, glRendererService.renderer.domElement);
                controls.zoomSpeed *= 1.0;

            }
        }
    }]);

