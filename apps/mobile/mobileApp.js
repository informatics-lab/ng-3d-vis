'use strict';

angular.module('mobileApp', ["informatics-badge-directive"])

    .controller('AppCtrl', ['$scope', 'glMobileSocketService', function ($scope, glMobileSocketService) {

        $scope.socketService = glMobileSocketService;

        //TODO initialise phone controller


    }]);