'use strict';

angular.module('ngWebglDemo')
	.service('glSphereModelService', function($rootScope) {
		var vm = this;
		vm.radius = 100;
		vm.resx = 20;
		vm.resy = 200;
		vm.posx = 0;
		vm.posy = -200;
		vm.posz = 0;
		vm.rotx = 0;
		vm.roty = 0;
		vm.rotz = 0;

		var broadcastUpdate = function() {
									$rootScope.$broadcast('update');
								}

		$rootScope.$watch( function(){return vm.radius;}, broadcastUpdate);
		$rootScope.$watch( function(){return vm.resx;}, broadcastUpdate);
		$rootScope.$watch( function(){return vm.resy;}, broadcastUpdate);
		$rootScope.$watch( function(){return vm.posx;}, broadcastUpdate);
		$rootScope.$watch( function(){return vm.posy;}, broadcastUpdate);
		$rootScope.$watch( function(){return vm.posz;}, broadcastUpdate);
		$rootScope.$watch( function(){return vm.rotx;}, broadcastUpdate);
		$rootScope.$watch( function(){return vm.roty;}, broadcastUpdate);
		$rootScope.$watch( function(){return vm.rotz;}, broadcastUpdate);

		return vm;
	});