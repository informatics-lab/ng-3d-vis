/**
 * Created by tom on 21/07/2015.
 */
'use strict';

angular.module('three')
    .directive('glMobileConnection', function () {
        return {
            restrict: 'E',
            scope: {
            },
            controller: mobileConnectionController,
            controllerAs: 'vm',
            template: '<i id="mobileConnection" class="fa fa-mobile fa-5x" style="color:white; position: absolute; bottom: 10px; right: 10px;"></i>',
            link: mobileConnectionPostLink
        }
    });

function mobileConnectionPostLink(scope, elem, attrs) {
    elem.on('click', function() {
        if(scope.vm.socketService.connectedToRoom) {
            scope.vm.disconnect();
        } else {
            scope.vm.connect();
        }
    });
}

function mobileConnectionController($scope, glSocketService) {
    var vm = this;
    vm.socketService = glSocketService;

    vm.connect = function () {
        console.log("connecting...");
        vm.socketService.connect();
    };

    vm.disconnect = function() {
        console.log("disconnecting...");

        vm.socketService.roomId = null;
        vm.socketService.connectedToRoom = false;
        vm.socketService.socket = null;
    }
}