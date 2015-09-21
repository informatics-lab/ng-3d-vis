'use strict';

angular.module('mobileApp')
    .service('glMobileSocketService', function ($rootScope, glCameraService) {
        var vm = this;

        vm.connectedToRoom = false;
        vm.connectionStatus = "disconnected";

        //vm.roomId = prompt("Enter sync ID");
        vm.connect = function(code) {

            if(!code || code === ""){
                alert("Please enter a valid sync code");
                return;
            }

            vm.socket = io.connect("http://sync.3dvis.informaticslab.co.uk/");

            vm.roomId = code;
            vm.socket.emit('subscribe', vm.roomId);
            vm.connectionStatus = "waiting";

            vm.socket.on('subscription', function (data) {
                vm.connectedToRoom = true;
                vm.roomId = data.roomId;
                console.log('roomId set to : ' + vm.roomId);

                //TODO swap alerts out for modals
                if (data.participants == 1) {
                    alert("Unable to find desktop app with matching sync code.\n\nPlease restart syncing process.");
                } else if (data.participants > 1) {
                    console.log("connection successful");
                    vm.connectionStatus = "connected";
                    $rootScope.$broadcast('socket connected', {});
                }
            });

            vm.socket.on('camera', function (data) {

                console.log("cam data received", data);

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