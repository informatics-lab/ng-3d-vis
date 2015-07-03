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

		return vm;
	});