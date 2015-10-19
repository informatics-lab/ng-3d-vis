'use strict';

angular.module('three')
    .directive('glOrbitControls', function () {
        return {
            restrict: 'A',
            require: '^glScene',
            link: function (scope, element, attrs, sceneCtrl) {

                var controls = new THREE.OrbitControls(sceneCtrl.cameraService.camera, sceneCtrl.rendererService.renderer.domElement);
                controls.zoomSpeed *= 0.5;

                console.log(controls.target);

            }
        }
    });

