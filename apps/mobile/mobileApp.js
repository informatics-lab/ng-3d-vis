'use strict';

angular.module('mobileApp', ["informatics-badge-directive", "three"])

    .controller('AppCtrl', ['$scope', 'glMobileSocketService', 'glSceneService', 'glCameraService', 'glRendererService', function ($scope, glMobileSocketService, glSceneService, glCameraService, glRendererService) {

        $scope.socketService = glMobileSocketService;

        $scope.width = function() {
            return window.innerWidth;
        };
        $scope.height = function() {
            return window.innerHeight;
        };

        //TODO initialise phone controller

        /******************************
         Init objects in shared services
         *******************************/

        //SCENE
        glSceneService.scene = new THREE.Scene();


        //CAMERA
        var fov = 45;
        var aspect = $scope.width() / $scope.height();
        var near = 0.01;
        var far = 10000;

        glCameraService.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        glCameraService.camera.position.z = 500;
        glCameraService.camera.lookAt(new THREE.Vector3(0, 0, 0));
        glCameraService.cameraNormal = new THREE.Vector3(0,0,-1);


        //RENDERER
        glRendererService.renderer = new THREE.WebGLRenderer({antialias: true});
        glRendererService.renderer.setSize($scope.width(), $scope.height());
        glRendererService.renderer.setClearColor(0x2222ee);


    }]);