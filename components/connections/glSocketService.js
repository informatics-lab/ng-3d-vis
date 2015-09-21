'use strict';

angular.module('three')
    .service('glSocketService', function ($rootScope, glCameraService) {
        var vm = this;

        vm.cameraService = glCameraService;

        vm.roomId = null;
        vm.connectedToRoom = false;
        vm.connectionStatus = "disconnected";

        vm.connect = function () {
            vm.socket = io.connect("http://sync.3dvis.informaticslab.co.uk/");

            vm.socket.emit('subscribe', '');

            vm.socket.on('subscription', function (data) {
                vm.connectedToRoom = true;
                vm.roomId = data.roomId;

                //TODO swap alerts out for modals
                if (data.participants == 1) {
                    vm.connectionStatus = "waiting";
                    $rootScope.$broadcast('connection-code', vm.roomId);
                } else if (data.participants > 1) {
                    vm.connectionStatus = "connected";
                    $rootScope.$broadcast('')
                }
            });

            vm.socket.on('camera', function (data) {

                vm.cameraService.camera.position.set(
                    data.message.position.x,
                    data.message.position.y,
                    data.message.position.z
                );

                vm.cameraService.camera.setRotationFromQuaternion(
                    new THREE.Quaternion(
                        data.message.quaternion._x,
                        data.message.quaternion._y,
                        data.message.quaternion._z,
                        data.message.quaternion._w
                    )
                );

            });

        };

        return vm;


    });