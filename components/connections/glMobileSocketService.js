'use strict';

angular.module('mobileApp')
    .service('glMobileSocketService', function ($rootScope) {
        var vm = this;

        vm.connectedToRoom = false;
        vm.connectionStatus = "disconnected";

        //vm.roomId = prompt("Enter sync ID");
        vm.connect = function(code) {

            vm.socket = io.connect("http://sync.3dvis.informaticslab.co.uk/");

            vm.roomId = code;
            vm.socket.emit('subscribe', '');
            vm.connectionStatus = "waiting";

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

        };

        return vm;

    });