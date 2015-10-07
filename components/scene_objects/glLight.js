'use strict';

angular.module('three')
    .directive('glLight', function () {
        return {
            restrict: 'E',
            require: '^glScene',
            scope: {
                name: '@'
            },
            link: postLightLink
        }
    });

function postLightLink(scope, element, attrs, parentCtrl) {

    var lightColor = 0xFFFFFF;
    var dirLightIntensity = 3;

    var dirLight = new THREE.DirectionalLight(lightColor, dirLightIntensity);
    dirLight.position.set(0.0, 20.0, 20.0);

    parentCtrl.sceneService.addSomething(scope.name, dirLight);

}