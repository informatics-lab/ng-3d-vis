'use strict';

/*
 * As this is providing our constants all provided vars will be capitalised
 */
angular.module('three')
    .factory('glConstantsService', function () {

        // for some reason this means it will run at 30 frames per second ?
        var FPS = 4;

        // the scaling factor for height
        var HEIGHT_SCALE_FACTOR = 3;

        //the factor at which data from the video will be down-sampled by
        var DATA_DOWNSAMPLING_FACTOR = 1;

        var service = {
            FPS : FPS,
            HEIGHT_SCALE_FACTOR : HEIGHT_SCALE_FACTOR,
            DATA_DOWNSAMPLING_FACTOR : DATA_DOWNSAMPLING_FACTOR
        };

        return service;
    });