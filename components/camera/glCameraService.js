'use strict';

angular.module('three')
    .service('glCameraService', function ($rootScope) {

        $rootScope.$on("update", function () {
            TWEEN.update();
        });

        var vm = this;

        vm.camera = null;

        vm.defaultPosition = {
            x: 230,
            y: 84,
            z: 326
        };

        vm.moveCamera = function (pos, lookAtMiddle) {
            vm.tweening = true;
            var tween = new TWEEN.Tween(vm.camera.position)
                .to({x: pos.x, y: pos.y, z: pos.z}, 3000)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onUpdate(function () {
                    if (lookAtMiddle) {
                        vm.camera.lookAt(new THREE.Vector3(0, 0, 0));
                    }
                })
                .onComplete(function () {
                    $rootScope.$broadcast('tween complete');
                    vm.tweening = false;
                })
                .start();
        };


        return vm;
    });