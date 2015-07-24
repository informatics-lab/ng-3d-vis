'use strict';

angular.module('three')
    .factory('glCameraService', function ($rootScope) {

        $rootScope.$on("update", function () {
            TWEEN.update();
        });

        var service = {

            camera: null,

            moveCamera: function (pos) {
                var tween = new TWEEN.Tween(service.camera.position)
                    .to({x: pos.x, y: pos.y, z: pos.z}, 3000)
                    .easing(TWEEN.Easing.Sinusoidal.InOut)
                    .onUpdate(function () {
                    })
                    .onComplete(function () {
                    })
                    .start();
            }
        };

        return service;
    });