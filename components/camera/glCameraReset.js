
angular.module('three')
    .directive('glCameraReset', function(glCameraService) {
        return {
            restrict: 'E',
            require: "^glScene",
            template: '<i id="resetCamera" class="fa fa-retweet fa-5x" style="color:white; position: absolute; top: 10px; left: 10px; cursor: pointer;"></i>',
            link: function(scope, elem, attrs) {
                elem.on('click', function() {
                    glCameraService.moveCamera(glCameraService.defaultPosition, true);
                });
            }
        };
    });
