'use strict';

angular.module('desktopApp', ["informatics-badge-directive", "three"])

    .controller('AppCtrl', ['$scope', 'glSceneService', 'glCameraService', 'glRendererService', 'glVideoService','glCoordService', function ($scope, glSceneService, glCameraService, glRendererService, glVideoService, glCoordService) {

        $scope.width = function () {
            return window.innerWidth;
        };
        $scope.height = function () {
            return window.innerHeight;
        };

        $scope.videoUrl = 'http://ec2-52-16-246-202.eu-west-1.compute.amazonaws.com:9000/molab-3dwx-ds/media/55896829e4b0b14cba17273c';


        $scope.toggleMacro = function () {
            $scope.$broadcast('toggleMacro');
        };

        $scope.connect = function () {
            console.log("parent");
        };



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
        glRendererService.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
        glRendererService.renderer.setSize($scope.width(), $scope.height());

        /*
         * commented out as have set background to transparent
         */
        //glRendererService.renderer.setClearColor(0x2222ee);

        //VIDEO DATA
        glVideoService.loadData($scope.videoUrl);

        $scope.$on('video data loaded', function() {
            console.log("video ready");
            $scope.$broadcast('init scene');

        });


    }]);