'use strict';

angular.module('three')
    .directive('glLayeredSky', function () {
        return {
            restrict: 'E',
            require: "^glScene",
            scope: {
                'name': '@'
            },
            controller: layeredSkyController,
            controllerAs: 'vm',
            link: function (scope, element, attrs, parentCtrl) {

                var layerContainer = new THREE.Object3D();

                scope.$on('frame updated', function () {

                    layerContainer.children.forEach(function (child) {
                        layerContainer.remove(child);
                    });

                    /*
                     * Loops through each specified model level (in the current video frame).
                     * Constructs the THREE.Mesh for it and adds it to the layer container.
                     */

                    // EITHER enable to render selection of levels
                    //var levels = [1, 10, 20];
                    //for (var i = 0; i < levels.length; i++) {
                    //    var layer = scope.vm.getLayer(levels[i]);
                    //    layerContainer.add(layer);
                    //
                    //}

                    // OR enable to render all levels
                    for (var i = 0; i < scope.vm.videoService.data.data_dimensions.z; i++) {
                        var layer = scope.vm.getLayer(i);
                        layerContainer.add(layer);

                    }

                });


                parentCtrl.sceneService.addSomething(scope.name, layerContainer);

            }
        }
    });

function layeredSkyController($scope, $rootScope, glVideoService) {
    var vm = this;

    vm.videoService = glVideoService;

    /*
     * Returns the index of the tile within a given video frame.
     * 1 tile contains all the data for one model level.
     * Arguably could be migrated into the video service.
     */
    vm.getTileIndex = function (levelNumber) {
        var x = vm.videoService.data.resolution.x / vm.videoService.data.data_dimensions.x;
        var y = vm.videoService.data.resolution.y / vm.videoService.data.data_dimensions.y;

        // ~~ truncates the decimal part of a number and is (much) faster than .toFixed(0)
        return {
            xIndex: levelNumber % ~~(x),
            yIndex: ~~((levelNumber / x) % y),
            channelIndex: ~~(levelNumber / (x * y))
        };
    };

    /*
     * Draws the tile data onto the canvas
     */
    vm.drawTileTexture = function (levelNumber, canvas) {

        var canvasContext = canvas.getContext('2d');
        var tileIndex = vm.getTileIndex(levelNumber);

        var xOrigin = vm.videoService.data.data_dimensions.x * tileIndex.xIndex;
        var yOrigin = vm.videoService.data.resolution.y - (vm.videoService.data.data_dimensions.y * tileIndex.yIndex);

        canvasContext.drawImage(vm.videoService.frame,
            xOrigin,
            yOrigin,
            vm.videoService.data.data_dimensions.x,
            vm.videoService.data.data_dimensions.y,
            0,
            0,
            canvas.width,
            canvas.height);

        var tileData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);

        var buf = new ArrayBuffer(tileData.data.length);
        var buf8 = new Uint8ClampedArray(buf);
        var buf32 = new Uint32Array(buf);
        buf8.set(tileData.data);

        for (var i = 0; i < buf32.length; i++) {
            var v = (buf32[i] >> (tileIndex.channelIndex * 8)) & 0xff;
            buf32[i] = ((v * 0.4) << 24) | // a
            (v << 16) | // b
            (v << 8) | // g
            v; // r

        }
        tileData.data.set(buf8);
        canvasContext.putImageData(tileData, 0, 0);

    };

    /*
     * Returns a THREE.Mesh object representative of the given model level's data.
     */
    vm.getLayer = function (levelNumber) {

        var canvas = document.createElement('canvas');
        //override our texture dimensions to be square number else THREE complains.
        canvas.width = 512//vm.videoService.data.data_dimensions.x;
        canvas.height = 512//vm.videoService.data.data_dimensions.y;

        vm.drawTileTexture(levelNumber, canvas);

        var layerTexture = new THREE.Texture(canvas);
        layerTexture.needsUpdate = true;

        var layerMaterial = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            map: layerTexture,
            transparent: true,
            specular: 0xffffff,
            shininess: 90
        });

        var layerGeometry = new THREE.PlaneBufferGeometry(vm.videoService.data.data_dimensions.x, vm.videoService.data.data_dimensions.y);

        var layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
        layerMesh.castShadow = true;
        layerMesh.receiveShadow = true;

        //sets the meshes height and rotation above ground
        layerMesh.position.y = (levelNumber * 10);
        layerMesh.rotation.x = -Math.PI * 0.5;

        return layerMesh;
    };


}