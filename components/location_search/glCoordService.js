'use strict';

angular.module('three')
    .service('glCoordService', ['$rootScope', 'glImageService', 'glConstantsService', function ($rootScope, glImageService, glConstantsService) {
        var vm = this;

        vm.videoService = glImageService;
        vm.constants = glConstantsService;

        $rootScope.$on('video data loaded', function() {

                // We're assuming for now that we have a rectangle along lat/lon lines
                // Later, might need to worry about the meridian -180/180
                var data_dimensions = vm.videoService.data.data_dimensions;
                vm.grid_dims = {
                    x: data_dimensions.x,
                    y:data_dimensions.z * vm.constants.HEIGHT_SCALE_FACTOR,
                    z: data_dimensions.y
                };

                vm.minX = -vm.grid_dims.x / 2;
                vm.minZ = -vm.grid_dims.z / 2;
                vm.maxX = vm.grid_dims.x / 2;
                vm.maxZ = vm.grid_dims.z / 2;

                vm.maxLat = -90;
                vm.minLat = 90;
                vm.maxLon = -180;
                vm.minLon = 180;
                vm.videoService.data.geographic_region.forEach(function (bound) {
                    if (bound.lat > vm.maxLat) {
                        vm.maxLat = bound.lat;
                    }
                    if (bound.lat < vm.minLat) {
                        vm.minLat = bound.lat;
                    }
                    if (bound.lng > vm.maxLon) {
                        vm.maxLon = bound.lng;
                    }
                    if (bound.lng < vm.minLon) {
                        vm.minLon = bound.lng;
                    }
                });


        });

        vm.lookupCoordX = function (lon) {
            return vm.lookupCoord(lon, vm.minLon, vm.maxLon, vm.grid_dims.x, vm.minX);
        };

        vm.lookupCoordZ = function (lat) {
            return -vm.lookupCoord(lat, vm.minLat, vm.maxLat, vm.grid_dims.z, vm.minZ);
        };

        vm.lookupCoord = function (val, min, max, grid, btm_left) {
            return (((val - min) / (max - min)) * grid) + btm_left;
        };

        vm.lookupCoords = function (latlon) {
            return {
                x: vm.lookupCoordX(latlon.lon),
                y: -(vm.grid_dims.y/2) * 0.99,               //setting this to the bottom of the cube?
                z: vm.lookupCoordZ(latlon.lat)
            };
        };

        vm.lookupLat = function (z) {
            return vm.lookupCoord(-z, vm.minZ, vm.maxZ, (vm.maxLat - vm.minLat), vm.minLat);
        }

        vm.lookupLon = function (x) {
            return vm.lookupCoord(x, vm.minX, vm.maxX, (vm.maxLon - vm.minLon), vm.minLon);
        }

        //TODO lookup lat lng from camera position
        vm.lookupLatLon = function (position) {
            return {
                lat: vm.lookupLat(position.z),
                lon: vm.lookupLon(position.x)
            };
        };

        return vm;
    }]);
