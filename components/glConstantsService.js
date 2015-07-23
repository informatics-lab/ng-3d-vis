'use strict';

//as this class is providing our constants so all provided vars will be capitalised
angular.module('three')
    .service('glConstantsService', function () {

        var FPS = 30;

        return {
            FPS : FPS
        }
    });