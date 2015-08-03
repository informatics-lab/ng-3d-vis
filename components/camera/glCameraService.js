'use strict';

angular.module('three')
    .service('glCameraService', function ($rootScope) {

        $rootScope.$on("update", function () {
            TWEEN.update();
        });

        var vm = this;

        vm.camera = null;

        vm.moveCamera = function (pos) {
            var tween = new TWEEN.Tween(vm.camera.position)
                .to({x: pos.x, y: pos.y, z: pos.z}, 3000)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onUpdate(function () {
                })
                .onComplete(function () {
                })
                .start();
        };

        return vm;
    });