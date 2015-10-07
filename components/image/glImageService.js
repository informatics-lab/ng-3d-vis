'use strict';

angular.module('desktopApp')
    .service('glImageService', ['$rootScope', '$http', 'glConstantsService', function ($rootScope, $http, glConstantsService) {

        var vm = this;
        vm.src = null;

        vm.data = {
            data_dimensions: {x: 300, y: 200, z: 30},
            forecast_reference_time: "2013-10-18T03:00:00.000Z",
            geographic_region: [{"lat": "-1.25", "lng": "1.0"}, {"lat": "-0.653", "lng": "1.0"}, {"lat": "-0.653", "lng": "1.897"}, {"lat": "-1.25", "lng": "1.897"}],
            model: 'london',
            phenomenon: 'cloud_fraction',
            processing_profile: 'default',
            resolution: {x: 512, y: 2048}
        };
        vm.frame = document.createElement('canvas');
        // document.getElementById('tst').appendChild(vm.frame);

        vm.loadData = function(file){
            vm.src = file;
            vm.drawImage();
        }

        vm.drawImage = function() {
            vm.frame.width = vm.data.resolution.x / glConstantsService.DATA_DOWNSAMPLING_FACTOR;
            vm.frame.height = vm.data.resolution.y / glConstantsService.DATA_DOWNSAMPLING_FACTOR;
            var context = vm.frame.getContext('2d');
            var img = new Image();
            img.onload = function(){
                context.drawImage(img, 0, 0, vm.frame.width * glConstantsService.DATA_DOWNSAMPLING_FACTOR, vm.frame.height * glConstantsService.DATA_DOWNSAMPLING_FACTOR, 0, 0, vm.frame.width, vm.frame.height);         
                $rootScope.$broadcast('video data loaded'); 
                $rootScope.$broadcast('frame updated'); 
            }
            img.src = vm.src; 
            // $rootScope.$broadcast('image data loaded'); 
                  
        }

        
        

        return vm;
    }]);
