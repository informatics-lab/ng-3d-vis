'use strict';

angular.module('three')
  .directive('glLocationMessages', function () {
    return {
      restrict: 'E',
      scope: {
      },
      controller: locMsgController,
      controllerAs: 'vm'
    }
  });

function locMsgController($scope, toaster, glCoordService) {
  var vm = this;

  vm.coordService = glCoordService;

  vm.messages = [
                  { minLat: 51.5, maxLat: 53, minLon: -5.5, maxLon: -2.5, 
                    todo: function(val){toaster.pop('info', "Here Be Dragons", "Welcome to Wales", 10000);}
                  }
                ]

  $scope.$on('position_change', function(evt, args){
    for (var i=0; i<vm.messages.length; i++){
      var msg = vm.messages[i];
      if ((msg.minLon < args.position.lon) && (args.position.lon < msg.maxLon) && (msg.minLat < args.position.lat) && (args.position.lat < msg.maxLat)){
        msg.todo(args.position);
      }
    }
  })
}