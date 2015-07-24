'use strict';

angular.module('three')
    .directive('glStats', function () {
        return {
            restrict: 'A',
            link: function statsPostLink(scope, element, attrs) {

                var container = element[0];

                var stats = new Stats();
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.bottom = '0px';
                stats.domElement.style.zIndex = 100;

                container.appendChild(stats.domElement);

                scope.$on('update', function() {
                    stats.update();
                });

            }
        }
    });

