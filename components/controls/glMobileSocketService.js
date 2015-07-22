'use strict';

angular.module('mobileApp')
    .service('glMobileSocketService', function () {
        var vm = this;

        vm.connectedToRoom = false;
        vm.connectionStatus = "disconnected";

        vm.roomId = prompt("Enter sync ID");
        if(vm.roomId) {

            vm.socket.emit('subscribe', vm.roomId);
            vm.connectionStatus = "waiting";
            vm.socket = io.connect("http://sync.3dvis.informaticslab.co.uk/");

            vm.socket.on('subscription', function (data) {
                vm.connectedToRoom = true;
                vm.roomId = data.roomId;
                console.log('roomId set to : ' + vm.roomId);

                //TODO swap alerts out for modals
                if (data.participants == 1) {
                    alert("open main app in a desktop first");
                } else if (data.participants > 1) {
                    vm.connectionStatus = "connected";
                }
            });

            vm.send = function(message) {
                vm.socket.emit('', {
                    room : roomId,
                    message : message
                });
            };

        }



    });