'use strict';

angular.module('three')
    .service('glSceneService', function () {
        var vm = this;

        vm.scene = null;
        vm.scene2 = null;
        vm.children = {};

        vm.addSomething = function (name, thing) {
            console.log("SceneService adding", name);
            vm.children[name] = thing;
            vm.scene.add(thing);
        };

        vm.addSomething2 = function (name, thing) {
            console.log("SceneService adding", name);
            vm.children[name] = thing;
            vm.scene2.add(thing);
        };

        vm.removeSomething = function (name) {
            var thing = vm.children[name];
            if(thing) {
                vm.scene.remove(thing);
                delete vm.children[name];
            }
        };

        vm.removeSomething2 = function (name) {
            var thing = vm.children[name];
            if(thing) {
                vm.scene2.remove(thing);
                delete vm.children[name];
            }
        };

        return vm;
    });
