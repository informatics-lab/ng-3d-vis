'use strict';

angular.module('three')
    .directive('glBox', function () {
        return {
            restrict: 'E',
            require: '^glScene',
            scope: {
                name: '@'
            },
            link: postBoxLink
        }
    });

function postBoxLink(scope, element, attrs, parentCtrl) {

    var boxGeom = new THREE.BoxGeometry(100,100,100);
    var boxMaterial = new THREE.MeshLambertMaterial({
        color: 0xffff00,
        shading: THREE.FlatShading,
        vertexColors: THREE.VertexColors
    });
    var box = new THREE.Mesh(boxGeom, boxMaterial);

    parentCtrl.sceneService.addSomething(scope.name, box);

}