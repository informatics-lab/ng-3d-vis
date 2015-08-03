'use strict';

angular.module('three')
    .service('glRendererService', function () {
        var vm = this;

        vm.renderer = null;

        return vm;
    });