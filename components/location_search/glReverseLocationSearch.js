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

function stringify(latlon) {
    return latlon.lat.toFixed(1) + ', ' + latlon.lon.toFixed(1);
}

function reverseLocSearchController($scope, $rootScope, $interval, glCoordService, glCameraService) {
    var vm = this;
    vm.prev = {lat:0,lon:0};

    var checkPosition = function() {
        if(vm.position){// && glCameraService.camera.position.equals(vm.position)) {
            var loc = vm.coordService.lookupLatLon(vm.position);
            console.log(loc);
            vm.latlon = loc;
            if ((vm.latlon.lat !== vm.prev.lat) || (vm.latlon.lon !== vm.prev.lon)){
                $rootScope.$broadcast('position_change', {position:vm.latlon});
            }
            vm.prev = vm.latlon;
            var request = {
                location: new google.maps.LatLng(loc.lat, loc.lon),
                radius: '100'
              };
            vm.place_search.nearbySearch(request, callback);
            function callback(results, status){
                var filterfn = function(el){return el.types.indexOf("political") > -1};
                var political_results = results.filter(filterfn);
                try {
                    vm.loc_input.value = political_results[0].name;
                }
                catch (err) {
                    vm.loc_input.value = stringify(vm.latlon);
                }
            }
        }
        vm.position = new THREE.Vector3(glCameraService.camera.position.x,glCameraService.camera.position.y,glCameraService.camera.position.z);
    };

    $interval(checkPosition, 2000);

    vm.coordService = glCoordService;
    vm.cameraService = glCameraService;
}