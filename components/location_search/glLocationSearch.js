'use strict';

angular.module('ngWebglDemo')
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
  google.maps.event.addListener(scope.autocomplete, 'place_changed', function() {
    //infowindow.close();
    var place = scope.autocomplete.getPlace();
    console.log(place);
    var loc = {lat:place.geometry.location.A, lon:place.geometry.location.F};
    var newCoords = scope.vm.coordService.lookupCoords(loc);
    console.log(newCoords);
    scope.vm.cameraService.movefunc(newCoords);
  });
}

function locSearchController($scope, glCoordService, glCameraModelService) {
  var vm = this;

  vm.coordService = glCoordService;
  vm.cameraService = glCameraModelService;
  vm.coordService.initialize($scope.griddims, $scope.geobounds);
}