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

        /*
         * load metadata from data service
         */
        vm.loadData = function (url) {
            vm.data =   {
                          "_links" : {
                            "self" : {
                              "href" : "http://data.3dvis.informaticslab.co.uk/molab-3dwx-ds/media/562e3056e4b081572780d0d9"
                            },
                            "data" : {
                              "href" : "http://data.3dvis.informaticslab.co.uk/molab-3dwx-ds/media/562e3056e4b081572780d0d9/data"
                            }
                          },
                          "data_dimensions" : {
                            "x" : 621,
                            "y" : 810,
                            "z" : 37
                          },
                          "forecast_reference_time" : "2015-10-26T09:00:00.000Z",
                          "geographic_region" : [ {
                            "lat" : 48.7,
                            "lng" : -10.2
                          }, {
                            "lat" : 59.2,
                            "lng" : -10.2
                          }, {
                            "lat" : 59.2,
                            "lng" : 2.4
                          }, {
                            "lat" : 48.7,
                            "lng" : 2.4
                          } ],
                          "model" : "UKV",
                          "phenomenon" : "cloud_volume_fraction_in_atmosphere_layer",
                          "processing_profile" : "UKV2EGRR",
                          "resolution" : {
                            "x" : 2048,
                            "y" : 4096
                          }
                        };
            loadVideo(url);
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
