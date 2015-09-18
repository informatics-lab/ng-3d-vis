'use strict';

angular.module('three')
    .directive('glBackground', function () {
        return {
            restrict: 'E',
            require: '^glScene',
            scope: {
                name: '@'
            },
            link: postBackgroundLink,
            controller: backgroundController,
            controllerAs: 'vm'
        }
    });

function postBackgroundLink(scope, element, attrs, parentCtrl) {
    function getGradient(h, w){
        var canvas = document.createElement( 'canvas' );
        canvas.width = w;
        canvas.height = h;
        var context = canvas.getContext( '2d' );
        var gradient = context.createLinearGradient( canvas.width / 2, 0, canvas.width / 2, canvas.height);
        gradient.addColorStop( 0.1, 'rgba(160,150,190,1)' );
        gradient.addColorStop( 1, 'rgba(150,150,200,1)' );
        context.fillStyle = gradient;
        context.fillRect( 0, 0, canvas.width, canvas.height );
        var shadowTexture = new THREE.Texture( canvas );
        shadowTexture.needsUpdate = true;
        return shadowTexture;
    }

    function draw(){
        var dims = scope.vm.videoService.data.data_dimensions;
        dims.y += 2;
        var boxDims = new THREE.Vector3(dims.x,
                            dims.z * scope.vm.constants.HEIGHT_SCALE_FACTOR + 1,
                            dims.y);

        var boxGeom = new THREE.BoxGeometry(boxDims.x, boxDims.y, boxDims.z);

        var gradient = getGradient(boxDims.y, boxDims.z);
        var boxMaterial = new THREE.MeshBasicMaterial({
            map: gradient,
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

function backgroundController($scope, glVideoService, glConstantsService) {
    var vm = this;

    vm.videoService = glVideoService;
    vm.constants = glConstantsService;
}