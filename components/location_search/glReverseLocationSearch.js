'use strict';

angular.module('three')
    .directive('glReverseLocationSearch', function () {
        return {
            restrict: 'E',
            scope: {},
            controller: reverseLocSearchController,
            controllerAs: 'vm'
        }
    });


function reverseLocSearchController($scope, $interval, glCoordService, glCameraService) {
    var vm = this;

    var checkPosition = function() {
        if(vm.position && glCameraService.camera.position.equals(vm.position)) {
            //TODO lookup camera position as lat lng and reverse geocode to placename

        }
        vm.position = new THREE.Vector3(glCameraService.camera.position.x,glCameraService.camera.position.y,glCameraService.camera.position.z);
    };

    $interval(checkPosition, 2000);

    vm.coordService = glCoordService;
    vm.cameraService = glCameraService;
}