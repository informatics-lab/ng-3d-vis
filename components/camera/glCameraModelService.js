'use strict';

angular.module('ngWebglDemo')
    .service('glCameraModelService', function ($rootScope) {
        var vm = this;
        vm.camera = null;

        vm.setupCamera = function (aspect, standoff, z_scaling, datashape) {
            vm.camera = new THREE.PerspectiveCamera(45, aspect, 0.01, 10000);
            vm.camera.rotation.order = "YXZ";
            vm.camera.position.set(datashape.x * standoff,
                datashape.z * standoff * z_scaling * 1.1, // 1.1 fac to get rid of
                datashape.y * standoff * 1.05); // geometrically perfect camera perspective
            vm.camera.lookAt(new THREE.Vector3(0, 0, 0));
            vm.cameraNormal = new THREE.Vector3(0,0,-1);
        }

        return vm;
    });