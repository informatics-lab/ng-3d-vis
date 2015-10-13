'use strict';

angular.module('three')
  .directive('glDataSelection', function () {
    return {
      restrict: 'E',
      scope: {
        url: '='
      },
      controller: selectionController,
      controllerAs: 'vm',
      template: '<input ng-model="url" id="molabSelection" style="position:absolute; top:22px; left:50%; width:500px"/>',
      link: selectionPostLink
    }
  });

function selectionPostLink(scope, element, attrs) {
    scope.vm.loc_input = $('#molabSelection');

    scope.vm.loc_input.keyup(function (e) {
        if (e.keyCode == 13) {
            for (var i = scope.vm.sceneService.scene.children.length - 1; i >= 0; i--) {
              var obj = scope.vm.sceneService.scene.children[i];
              scope.vm.sceneService.scene.remove(obj);
            }
            for (var i = scope.vm.sceneService.scene2.children.length - 1; i >= 0; i--) {
              var obj = scope.vm.sceneService.scene2.children[i];
              scope.vm.sceneService.scene2.remove(obj);
            }
            scope.vm.videoService.clear();
            scope.vm.videoService.loadData(scope.vm.loc_input.val());
        }
    });
}

function selectionController($scope, $rootScope, glVideoService, glSceneService) {
    var vm = this;

    vm.videoService = glVideoService;
    vm.sceneService = glSceneService;
}