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

    var boxGeom = new THREE.BoxGeometry(400, 100, 100);
    var boxMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        shading: THREE.FlatShading,
        vertexColors: THREE.VertexColors,
        side: THREE.BackSide
    });
    var box = new THREE.Mesh(boxGeom, boxMaterial);

    parentCtrl.sceneService.addSomething(scope.name, box);

}