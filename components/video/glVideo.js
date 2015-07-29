angular.module('desktopApp')
    .directive('glVideo', function() {
        return {
            restrict: 'E',
            controller: videoController,
            controllerAs: 'vm',
            scope: {
                'url': '=',
                'shrinkFactor': '='
            },
            link: function postLink(scope, element, attrs, parentCtrl) {
                var play = true;

                function initialize() {
                    var dims = scope.vm.dataService.getDims(scope.url);
                    var videoUrl = scope.url + '/data';

                    scope.vm.video = document.createElement( 'video' );
                    scope.vm.video.loop = true;
                    scope.vm.video.id = 'video';
                    scope.vm.video.type = ' video/ogg; codecs="theora, vorbis" ';
                    scope.vm.video.src = videoUrl;
                    scope.vm.video.crossOrigin = "Anonymous";
                    scope.vm.video.load(); // must call after setting/changing source
                    scope.vm.video.playbackRate = 1;
                    scope.vm.video.addEventListener('loadeddata', function() {
                        // Video is loaded and can be played
                        scope.vm.video.autoplay = true;
                        scope.vm.video.play();
                    });

                    //data video
                    var videoImage = document.createElement( 'canvas' );
                    videoImage.width = dims.textureshape.x / scope.shrinkFactor;// / 2.0;
                    videoImage.height = dims.textureshape.y / scope.shrinkFactor;
                    scope.vm.dataService.setVideoImage(videoImage);
                    scope.vm.dataService.setVideoDims(dims);

                    scope.vm.videoImageContext = scope.vm.dataService.videoImage.getContext( '2d' );
                    // background color if no video present
                    scope.vm.videoImageContext.fillStyle = '#000000';
                    scope.vm.videoImageContext.fillRect( 0, 0, scope.vm.dataService.videoImage.width, scope.vm.dataService.videoImage.height );
                }

                function update() {
                    requestAnimationFrame(update);
                    if ( scope.vm.video.readyState === scope.vm.video.HAVE_ENOUGH_DATA) {
                        var w = scope.vm.dataService.videoImage.width;
                        var h = scope.vm.dataService.videoImage.height;

                        scope.vm.videoImageContext.drawImage( scope.vm.video, 0, 0, w*scope.shrinkFactor, h*scope.shrinkFactor, 0, 0, w, h );
                        scope.vm.dataService.broadcastUpdate();

                    }
                }

                initialize();
                update();
            }
        };
    });

function videoController($scope, glVideoDataModelService) {
    var vm = this;
    vm.dataService = glVideoDataModelService;
}