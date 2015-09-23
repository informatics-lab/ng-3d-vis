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
            //template: '<span id="forecast-time" ></span>',
            link: forecastTimePostLink
        }
    });

function forecastTimePostLink(scope, elem, attrs) {
    elem.append('span');
    elem.addClass('forecast-time');

    scope.$on('frame updated', function () {
        scope.dateTime = new Date(scope.vm.videoService.data.forecast_reference_time);
        scope.dateTime = scope.dateTime.addHours(Math.floor(scope.vm.videoService.video.currentTime));
        //elem.append('span');
        //elem.addClass('forecast-time');
        elem.text(scope.dateTime);
    });
}

function forecastTimeController($scope, glVideoService, glConstantsService) {
    var vm = this;
    vm.videoService = glVideoService;
    vm.constants = glConstantsService;

    Date.prototype.addHours= function(h){
        this.setHours(this.getHours()+h);
        return this;
    }
}
