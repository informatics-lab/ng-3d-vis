'use strict';

angular.module('three')
    .directive('glBoxWireframe', function () {
        return {
            restrict: 'E',
            require: '^glScene',
            scope: {
                name: '@',
                width: '=',
                length: '=',
                depth: '='
            },
            link: postBoxWireframeLink
        }
    });

function postBoxWireframeLink(scope, element, attrs, parentCtrl) {

    var boxGeom = new THREE.BoxGeometry(scope.width, scope.depth, scope.length);
    boxGeom.doubleSided = true;

    var boxOutlineMesh = new THREE.Mesh( boxGeom );

    var boxOutLine = new THREE.BoxHelper( boxOutlineMesh );
    boxOutLine.material.color.set( "#000033" );

    parentCtrl.sceneService.addSomething( scope.name, boxOutLine );

}