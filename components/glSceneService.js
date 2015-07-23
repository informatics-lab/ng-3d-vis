'use strict';

angular.module('three')
    .service('glSceneService', function () {
        var vm = this;

        vm.scene = null;
        vm.children = {};

        vm.addSomething = function (name, thing) {
            vm.children[name] = thing;
            vm.scene.add(thing);
        };

        vm.removeSomething = function (name) {
            var thing = vm.children[name];
            if(thing) {
                vm.scene.remove(thing);
                delete vm.children[name];
            }
        };

        return vm;
    });