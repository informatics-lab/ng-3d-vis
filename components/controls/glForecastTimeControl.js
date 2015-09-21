/**
 * Created by msaunby.
 */
'use strict';

angular.module('three')
    .directive('glForecastTime', function () {
        return {
            restrict: 'E',
            scope: {
            },
            controller: forecastTimeController,
            controllerAs: 'vm',
            template: '<b id="forecastTime" style="color:white; position: absolute; bottom: 20px; right: 80px;">HELLO WORLD</b>',
            link: forecastTimePostLink
        }
    });

function forecastTimePostLink(scope, elem, attrs) {
    elem.on('click', function() {
        alert('Hello');
    });
}

function forecastTimeController($scope, glSocketService) {
    var vm = this;
}
