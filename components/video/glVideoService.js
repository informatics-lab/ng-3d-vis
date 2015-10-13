'use strict';

angular.module('desktopApp')
    .service('glVideoService', ['$rootScope', '$http', 'glConstantsService', function ($rootScope, $http, glConstantsService) {

        var vm = this;

        vm.data = null;
        vm.video = document.createElement('video');
        vm.frame = document.createElement('canvas');

        //used for debugging
        //document.getElementById('vid').appendChild(vm.video);
        //document.getElementById('canv').appendChild(vm.frame);

        vm.clear = function() {
            vm.data = null;
            vm.video = document.createElement('video');
            vm.frame = document.createElement('canvas');
        }
        /*
         * load metadata from data service
         */
        vm.loadData = function (url) {
            $http.get(url)
                .success(function (data, status, headers, config) {
                    vm.data = data;
                    loadVideo(vm.data._links.data.href);
                })
                .error(function (data, status, headers, config) {
                    alert("failed to load data : " + status);
                });
        };

        var loadVideo = function (url) {
            vm.video.loop = true;
            vm.video.id = 'video';
            vm.video.type = ' video/ogg; codecs="theora, vorbis" ';
            vm.video.src = url;
            vm.video.crossOrigin = "Anonymous";
            vm.video.load(); // must call after setting/changing source
            vm.video.playbackRate = 1;
            //vm.video.autoplay = true;

            vm.video.addEventListener('loadeddata', function () {
                $rootScope.$broadcast('video data loaded');
                vm.video.play();
            });
        };

        /*
         * On update message (broadcasted from our animation loop in glScene)
         * sample the video as its playing to capture a snapshot of the current frame.
         * This is then available within this service as the vm.frame obj.
         */
        $rootScope.$on('update', function () {
            vm.frame.width = vm.data.resolution.x / glConstantsService.DATA_DOWNSAMPLING_FACTOR;
            vm.frame.height = vm.data.resolution.y / glConstantsService.DATA_DOWNSAMPLING_FACTOR;
            var context = vm.frame.getContext('2d');
            context.drawImage(vm.video, 0, 0, vm.frame.width * glConstantsService.DATA_DOWNSAMPLING_FACTOR, vm.frame.height * glConstantsService.DATA_DOWNSAMPLING_FACTOR, 0, 0, vm.frame.width, vm.frame.height);
            $rootScope.$broadcast('frame updated');
        });

        return vm;
    }]);
