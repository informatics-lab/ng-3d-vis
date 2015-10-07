'use strict';

angular.module('three')
    .directive('glBackground', function () {
        return {
            restrict: 'E',
            require: '^glScene',
            scope: {
                name: '@',
                fillcolour: '@'
            },
            link: postBackgroundLink,
            controller: backgroundController,
            controllerAs: 'vm'
        }
    });

function postBackgroundLink(scope, element, attrs, parentCtrl) {
    function getFill(h, w, rgba){
        var canvas = document.createElement( 'canvas' );
        canvas.width = w;
        canvas.height = h;
        var context = canvas.getContext( '2d' );
        context.fillStyle = rgba;
        context.fillRect( 0, 0, canvas.width, canvas.height );
        var texture = new THREE.Texture( canvas );
        texture.needsUpdate = true;
        return texture;
    }

    function draw(){
        var dims = scope.vm.videoService.data.data_dimensions;
        dims.y += 2;
        var boxDims = new THREE.Vector3(dims.x + 5,
            (dims.z * scope.vm.constants.HEIGHT_SCALE_FACTOR) + 5,
                            dims.y + 5);

        var boxGeom = new THREE.BoxGeometry(boxDims.x, boxDims.y, boxDims.z);

        console.log('fill', scope.fillColour);
        var fill = getFill(boxDims.y, boxDims.z, scope.fillcolour);
        var boxMaterial = new THREE.MeshBasicMaterial({
            map: fill,
            shading: THREE.FlatShading,
            vertexColors: THREE.VertexColors,
            side: THREE.BackSide
        });
        var box = new THREE.Mesh(boxGeom, boxMaterial);

        parentCtrl.sceneService.addSomething(scope.name, box);
    }

    scope.$on('video data loaded', function() {
        draw();
    });
}

function backgroundController($scope, glImageService, glConstantsService) {
    var vm = this;

    vm.videoService = glImageService;
    vm.constants = glConstantsService;
}