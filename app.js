'use strict';

angular.module('ngWebglDemo', [])

  .controller('AppCtrl', ['$scope', 'glSphereModelService', function ($scope, glSphereModelService) {

    $scope.canvasWidth = 400;
    $scope.canvasHeight = 400;
    $scope.dofillcontainer = false;
    $scope.scale = 1;
    $scope.materialType = 'lambert';

    $scope.sphereService = glSphereModelService;

  }]);