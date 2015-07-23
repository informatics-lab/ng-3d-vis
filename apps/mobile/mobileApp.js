'use strict';

angular.module('mobileApp', ["informatics-badge-directive", "three"])

    .controller('AppCtrl', ['$scope', 'glMobileSocketService', function ($scope, glMobileSocketService) {

        $scope.socketService = glMobileSocketService;

        $scope.width = function() {
            return window.innerWidth;
        }
        $scope.height = function() {
            return window.innerHeight;
        }

        //TODO initialise phone controller


    }]);