'use strict';

angular.module('desktopApp', ["informatics-badge-directive", "three"])

    .controller('AppCtrl', ['$scope', 'glVideoDataModelService', 'glSkyboxParameterService', 'glSceneService', 'glCameraService', 'glRendererService', function ($scope, glVideoDataModelService, glSkyboxParameterService, glSceneService, glCameraService, glRendererService) {

        $scope.width = function () {
            return window.innerWidth;
        };
        $scope.height = function () {
            return window.innerHeight;
        };

        $scope.scale = 1;
        $scope.materialType = 'lambert';
        $scope.videoUrl = 'http://ec2-52-16-246-202.eu-west-1.compute.amazonaws.com:9000/molab-3dwx-ds/media/55896829e4b0b14cba17273c';

        $scope.videoService = glVideoDataModelService;
        $scope.paramService = glSkyboxParameterService;

        $scope.dims = $scope.videoService.getDims($scope.videoUrl);
        $scope.z_scaling = $scope.paramService.Z_SCALING;

        $scope.grid_dims = {
            x: $scope.dims.datashape.x,
            y: $scope.dims.datashape.z * $scope.z_scaling,
            z: $scope.dims.datashape.y
        };

        $scope.geo_bounds = [
            {
                lat: 48.7726557377,
                lng: -10.1181857923
            },
            {
                lat: 59.286557377,
                lng: -10.1181857923
            },
            {
                lat: 59.286557377,
                lng: 2.42998178506
            },
            {
                lat: 48.7726557377,
                lng: 2.42998178506
            }
        ];

        $scope.toggleMacro = function () {
            $scope.$broadcast('toggleMacro');
        };

        $scope.connect = function () {
            console.log("parent");
        };

        $scope.$on('skyboxReady', function () {
            // Begin
            $scope.$broadcast('initScene');
        })


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
        glCameraService.camera.position.z = 300;
        glCameraService.camera.lookAt(new THREE.Vector3(0, 0, 0));
        glCameraService.cameraNormal = new THREE.Vector3(0,0,-1);


        //RENDERER
        glRendererService.renderer = new THREE.WebGLRenderer({antialias: true});
        glRendererService.renderer.setSize($scope.width(), $scope.height());
        glRendererService.renderer.setClearColor(0x2222ee);



    }]);