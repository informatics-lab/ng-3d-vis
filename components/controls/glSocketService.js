'use strict';

angular.module('ngWebglDemo')
    .service('glSocketService', function ($rootScope, glCameraModelService) {
        var vm = this;

        vm.cameraService = glCameraModelService;

        vm.roomId = null;
        vm.connectedToRoom = false;
        vm.connectionStatus = "disconnected";

        vm.connect = function () {
            vm.socket = io.connect("http://sync.3dvis.informaticslab.co.uk/");

            vm.socket.emit('subscribe', '');

            vm.socket.on('subscription', function (data) {
                vm.connectedToRoom = true;
                vm.roomId = data.roomId;
                console.log('roomId set to : ' + vm.roomId);

                //TODO swap alerts out for modals
                if (data.participants == 1) {
                    vm.connectionStatus = "waiting";
                    $rootScope.$broadcast('socket', vm.connectionStatus);
                    alert("go to app and use code: "+ vm.roomId);
                } else if (data.participants > 1) {
                    vm.connectionStatus = "connected";
                    alert("mobile device connected!");
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


    });