'use strict';

angular.module('ngWebglDemo', ["informatics-badge-directive"])

  .controller('AppCtrl', ['$scope', 'glVideoDataModelService', 'glSkyboxParameterService', function ($scope, glVideoDataModelService, glSkyboxParameterService) {

    $scope.canvasWidth = window.innerWidth;
    $scope.canvasHeight = window.innerHeight;
    $scope.scale = 1;
    $scope.materialType = 'lambert';
    $scope.videoUrl = 'http://ec2-52-16-246-202.eu-west-1.compute.amazonaws.com:9000/molab-3dwx-ds/media/55896829e4b0b14cba17273c';

    $scope.videoService = glVideoDataModelService;
    $scope.paramService = glSkyboxParameterService;

    $scope.dims = $scope.videoService.getDims($scope.videoUrl);
    $scope.z_scaling = $scope.paramService.Z_SCALING;

    $scope.toggleMacro = function() {
    	$scope.$broadcast('toggleMacro');
    }

  }]);