'use strict';

angular.module('ngWebglDemo')
	.service('glVideoDataModelService', function($rootScope) {
		var vm = this;
		vm.videoImage = null;
		vm.videoDims = null;

		vm.setVideoImage = function(data) {
			vm.videoImage = data;
		}

		vm.setVideoDims = function(dims) {
			vm.videoDims = dims;
			$rootScope.$broadcast('videoLoaded');
		}

		vm.broadcastUpdate = function() {
			$rootScope.$broadcast('videoUpdate');
		}

		vm.getDims = function(url) {
            // using a synchronous request for now...
            var req = new XMLHttpRequest();
            req.open("get", url, false);
            req.send();
            var response = JSON.parse(req.responseText);

            var result = {datashape:null, textureshape:null};

            result.datashape = response.data_dimensions;
            result.datashape.y += 2; // just for now, to take account of padding
            result.textureshape = response.resolution;
            return result;
        }

		return vm;
	});