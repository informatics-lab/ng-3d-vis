'use strict';

angular.module('ngWebglDemo', [])

  .controller('AppCtrl', ['$scope', function ($scope) {

    $scope.canvasWidth = window.innerWidth;
    $scope.canvasHeight = window.innerHeight;
    $scope.scale = 1;
    $scope.materialType = 'lambert';

  }]);