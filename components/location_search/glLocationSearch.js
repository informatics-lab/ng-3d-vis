'use strict';

angular.module('three')
  .directive('glLocationSearch', function () {
    return {
      restrict: 'E',
      scope: { 
        'griddims': '=',
        'geobounds': '='
      },
      controller: locSearchController,
      controllerAs: 'vm',
      template: '<input type="text" class="rounded" id="molabSearchInput" placeholder="Enter a location" style="position:absolute; top:10px; left:10px;"/>',
      link: locSearchPostLink
    }
  });

//onfocus="javascript: if(this.value!==\'\') this.value=\'\';"

function locSearchPostLink(scope, element, attrs) {
  // location search
  scope.loc_input = $('#molabSearchInput')[0];
  var mapBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(scope.vm.coordService.minLat, scope.vm.coordService.minLon),
    new google.maps.LatLng(scope.vm.coordService.maxLat, scope.vm.coordService.maxLon)
  );
  scope.autocomplete = new google.maps.places.Autocomplete(scope.loc_input, {bounds:mapBounds});
  //scope.autocomplete.setBounds(mapBounds);

  //TODO add in elevation lookup so that we are always moved to ground level.
  google.maps.event.addListener(scope.autocomplete, 'place_changed', function() {
    //infowindow.close();
    var place = scope.autocomplete.getPlace();
    console.log(place);
    var loc = {lat:place.geometry.location.lat(), lon:place.geometry.location.lng()};
    var newCoords = scope.vm.coordService.lookupCoords(loc);
    console.log(newCoords);
    scope.vm.cameraService.moveCamera(newCoords);
  });
}

function locSearchController($scope, glCoordService, glCameraService) {
  var vm = this;

  vm.coordService = glCoordService;
  vm.cameraService = glCameraService;
  vm.coordService.initialize($scope.griddims, $scope.geobounds);
}