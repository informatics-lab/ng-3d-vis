/**
 * Created by tom on 22/07/2015.
 */
angular.module('three')
    .directive('glBox', function () {
        return {
            restrict: 'E',
            require: '^glScene',
            scope: {},
            link: postBoxLink
        }
    });

function postBoxLink(scope, element, attrs, parentCtrl) {

    scope.boxGeom = new THREE.BoxGeometry(100,100,100);
    scope.boxMaterial = new THREE.MeshLambertMaterial({
        color: 0xffff00,
        shading: THREE.FlatShading,
        vertexColors: THREE.VertexColors
    });
    scope.box = new THREE.Mesh(scope.boxGeom, scope.boxMaterial);

    parentCtrl.sceneService.addSomething(scope.box);

}