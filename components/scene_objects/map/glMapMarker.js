angular.module('three')
.directive('glMapMarker', function () {
  return {
    restrict: 'E',
    require: "^glScene",
    scope: {
      'name': '@'
    },
    controller: mapMarkerController,
    controllerAs: 'vm',
    link: function postLink(scope, element, attrs, parentCtrl) {

      scope.$on('video data loaded', function () {
        parentCtrl.sceneService.addSomething(scope.name, scope.vm.addMarker(attrs));
      });

    }
  };
});

function mapMarkerController($scope, glVideoService, glConstantsService) {
  var vm = this;
  vm.addMarker = function(attrs)
  {
    console.log("adding map marker", attrs);
    return null;
  };
}
