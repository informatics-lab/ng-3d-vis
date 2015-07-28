'use strict';

/*
 * As this is providing our constants all provided vars will be capitalised
 */
angular.module('three')
    .factory('glConstantsService', function () {

        // for some reason this means it will run at 30 frames per second ?
        var FPS = 40;

        // the scaling factor for height
        var HEIGHT_SCALE_FACTOR = 3;


        var service = {
            FPS : FPS,
            HEIGHT_SCALE_FACTOR: HEIGHT_SCALE_FACTOR
        };

        return service;
    });