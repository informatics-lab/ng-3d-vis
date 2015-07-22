'use strict';

angular.module('three')
    .service('glSceneService', function () {
        var vm = this;

        vm.scene = null;

        vm.addSomething = function (thing) {
            vm.scene.add(thing);
        };

        vm.removeSomething = function (thing) {
            vm.scene.remove(thing);
        };

        return vm;
    });