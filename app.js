'use strict';

angular.module('ngWebglDemo', [])

  .controller('AppCtrl', ['$scope', function ($scope) {

    $scope.canvasWidth = 1000;
    $scope.canvasHeight = 600;
    $scope.dofillcontainer = false;
    $scope.scale = 1;
    $scope.materialType = 'lambert';

  }]);