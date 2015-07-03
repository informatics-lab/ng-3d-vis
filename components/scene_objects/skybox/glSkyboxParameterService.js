'use strict';

angular.module('ngWebglDemo')
	.service('glSkyboxParameterService', function() {
		function getAlphaCorrection(opacFace, nSteps){
		    return opacFac/nSteps;
		}

		var vm = this;
		vm.Z_SCALING = 3.0;
		vm.CAMERA_STANDOFF = 1.3;

		vm.nSteps = 64;
		vm.shadeSteps = 16;
		var opacFac = 4.0;
		vm.alphaCorrection = getAlphaCorrection(opacFac, vm.nSteps);
		vm.mipMapTex = false;
		vm.downScaling = 1;
		vm.play = true;
		vm.ambience = 0.3;

		vm.fps = 60;

		vm.lightColor = 0xFFFFFF;
		vm.dirLightIntensity = 3;

		return vm;
	});