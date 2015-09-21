/**
 * Created by msaunby.
 */
'use strict';

angular.module('three')
    .directive('glForecastTime', function () {
        return {
            restrict: 'E',
            scope: {},
            controller: forecastTimeController,
            controllerAs: 'vm',
            template: '<span id="forecastTime" style="color:white; position: absolute; bottom: 20px; right: 80px;">{{dateTime}}</span>',
            link: forecastTimePostLink
        }
    });

function forecastTimePostLink(scope, elem, attrs) {
    elem.on('click', function() {
        console.log('forecastTime: click event');
    });
    scope.$on('frame updated', function () {
      //console.log('forecastTime: frame updated', scope.vm.videoService.video.currentTime);
      scope.dateTime = scope.vm.videoService.video.currentTime;
      // See http://www.inwebson.com/html5/custom-html5-video-controls-with-jquery/
    });
}

function forecastTimeController($scope, glVideoService, glConstantsService) {
    var vm = this;
    vm.videoService = glVideoService;
    vm.constants = glConstantsService;


}
