'use strict';

angular.module('mobileApp', ["three", "ngTouch"])

    .controller('AppCtrl', ['$scope', 'glMobileSocketService', 'glSceneService', 'glCameraService', 'glRendererService', function ($scope, glMobileSocketService, glSceneService, glCameraService, glRendererService) {

        $scope.width = function () {
            return window.innerWidth;
        };
        $scope.height = function () {
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
        glCameraService.cameraNormal = new THREE.Vector3(0, 0, -1);


        //RENDERER
        glRendererService.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        glRendererService.renderer.setSize($scope.width(), $scope.height());
        //glRendererService.renderer.setClearColor(new THREE.Color("rgb(255, 0, 0)"));

        window.onload = function () {
            $scope.setBodySize();
            $scope.$broadcast('init scene');
        };

        window.onresize = function () {
            $scope.setBodySize();
        };

        window.ondeviceorientation = function() {
            $scope.setBodySize();
        }

        $scope.setBodySize = function() {
            $('.container-fluid').css('width',$scope.width()+"px");
            $('.container-fluid').css('height',$scope.height()+"px");
        };

        $scope.connect = function() {
            var code = document.getElementById("connection-code").value;
            glMobileSocketService.connect(code);
        };

        $scope.$on('socket connected', function() {
            console.log('connection message received');
            $('#connection').fadeOut(500, function() {
                $('#controls').css("display","block");

                $('#controller').fadeIn(500, function() {
                    //$('body').css('background', 'url("../../images/controller.png") no-repeat center center fixed');
                    //$('body').css('background-size', '100%');
                });
            });
            $scope.$on('update', function() {
                glMobileSocketService.send({
                    'position' : {
                        x : glCameraService.camera.position.x,
                        y : glCameraService.camera.position.y,
                        z : glCameraService.camera.position.z
                    },
                    'quaternion' : {
                        _w : glCameraService.camera.quaternion._w,
                        _x : glCameraService.camera.quaternion._x,
                        _y : glCameraService.camera.quaternion._y,
                        _z : glCameraService.camera.quaternion._z
                    }
                });
            });
            $scope.$on('reset', function() {
                glCameraService.moveCamera(glCameraService.defaultPosition, true);
            });
        });


    }]);