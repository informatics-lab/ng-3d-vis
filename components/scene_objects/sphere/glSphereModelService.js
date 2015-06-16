'use strict';

angular.module('ngWebglDemo')
	.service('glSphereModelService', function($rootScope) {
		var vm = this;
		vm.radius = 150;
		vm.resx = 20;
		vm.resy = 200;
		vm.posx = 0;
		vm.posy = 0;
		vm.posz = 0;
		vm.rotx = 0;
		vm.roty = 0;
		vm.rotz = 0;

		var emitUpdate = function() {
									$rootScope.$broadcast('update');
								}

		$rootScope.$watch( function(){return vm.radius;}, emitUpdate);
		$rootScope.$watch( function(){return vm.resx;}, emitUpdate);
		$rootScope.$watch( function(){return vm.resy;}, emitUpdate);
		$rootScope.$watch( function(){return vm.posx;}, emitUpdate);
		$rootScope.$watch( function(){return vm.posy;}, emitUpdate);
		$rootScope.$watch( function(){return vm.posz;}, emitUpdate);
		$rootScope.$watch( function(){return vm.rotx;}, emitUpdate);
		$rootScope.$watch( function(){return vm.roty;}, emitUpdate);
		$rootScope.$watch( function(){return vm.rotz;}, emitUpdate);

		vm.setRadius = function(r) {
			vm.radius = r;
		}

		vm.setResolution = function(res) {
			vm.resolution = res;
		}

		vm.setHorizontalResolution = function(x) {
			vm.resolution[0] = x;
		}

		vm.setVerticalResolution = function(y) {
			vm.resolution[1] = y;
		}

		vm.setPosition = function(pos) {
			vm.position = pos;
		}

		vm.setXPosition = function(x) {
			vm.position[0] = x;
		}

		vm.setYPosition = function(y) {
			vm.position[1] = y;
		}

		vm.setZPosition = function(z) {
			vm.position[2] = z;
		}

		vm.setRotation = function(rot) {
			vm.rotation = rot;
		}

		vm.setXRotation = function(xr) {
			vm.rotation[0] = xr;
		}

		vm.setYRotation = function(yr) {
			vm.rotation[1] = yr;
		}

		vm.setZRotation = function(zr) {
			vm.rotation[2] = zr;
		}

		return vm;
	});