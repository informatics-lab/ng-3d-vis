'use strict';

angular.module('three')
    .directive('glReverseLocationSearch', function () {
        return {
            restrict: 'E',
            scope: {},
            template: '<input disabled type="text" class="rounded" id="molabLocation" placeholder="Location unknown" style="position:absolute; top:110px; left:10px;" onfocus="javascript: if(this.value!==\' \') this.value=\' \';"/>',
            controller: reverseLocSearchController,
            controllerAs: 'vm',
            link: reverseLocSearchPostLink
        }
    });

function reverseLocSearchPostLink(scope, element, attrs) {
  // location search
    scope.vm.latlon = null;
    scope.vm.loc_input = $('#molabLocation')[0];

    scope.vm.place_search = new google.maps.places.PlacesService(document.createElement('div'));
}

function reverseLocSearchController($scope, $interval, glCoordService, glCameraService) {
    var vm = this;

    var checkPosition = function() {
        if(vm.position && glCameraService.camera.position.equals(vm.position)) {
            //console.log(vm.position);
            var loc = vm.coordService.lookupLatLon(vm.position);
            console.log(loc);
            vm.latlon = loc;
            var request = {
                location: new google.maps.LatLng(loc.lat, loc.lon),
                radius: '200'//,
                //types: ['(cities)']
              };
            vm.place_search.nearbySearch(request, callback);
            function callback(results, status){
                console.log(results);
                vm.loc_input.value = results[0].name;
            }
        }
        vm.position = new THREE.Vector3(glCameraService.camera.position.x,glCameraService.camera.position.y,glCameraService.camera.position.z);
    };

    $interval(checkPosition, 2000);

    vm.coordService = glCoordService;
    vm.cameraService = glCameraService;
}