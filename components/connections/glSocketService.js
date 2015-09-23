'use strict';

angular.module('three')
    .service('glSocketService', function ($rootScope, glCameraService) {
        var vm = this;

        vm.roomId = null;
        vm.connectedToRoom = false;
        vm.connectionStatus = "disconnected";

        vm.connect = function () {
            vm.socket = io.connect("http://sync.3dvis.informaticslab.co.uk/");

            vm.socket.emit('subscribe', '');

            vm.socket.on('subscription', function (data) {
                vm.connectedToRoom = true;
                vm.roomId = data.roomId;

                if (data.participants == 1) {
                    vm.connectionStatus = "waiting";
                    $rootScope.$broadcast('connection-code', vm.roomId);
                } else if (data.participants > 1) {
                    vm.connectionStatus = "connected";
                    $rootScope.$broadcast('client connected',{});
                }
            });

            vm.socket.on('camera', function (data) {
                if(!glCameraService.tweening) {
                    glCameraService.camera.position.set(
                        data.message.position.x,
                        data.message.position.y,
                        data.message.position.z
                    );

                    glCameraService.camera.setRotationFromQuaternion(
                        new THREE.Quaternion(
                            data.message.quaternion._x,
                            data.message.quaternion._y,
                            data.message.quaternion._z,
                            data.message.quaternion._w
                        )
                    );
                }
            });

            vm.send = function(message) {
                vm.socket.emit('send camera', {
                    room : vm.roomId,
                    message : message
                });
            };

        };

        return vm;


    });