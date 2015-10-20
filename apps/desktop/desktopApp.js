'use strict';

var cam;
angular.module('desktopApp', ["informatics-badge-directive", "three", 'toaster', 'ngAnimate'])
    .controller('AppCtrl', ['$scope', '$timeout', '$http', 'glSceneService', 'glCameraService', 'glRendererService', 'glVideoService','glCoordService', 'glSocketService', function ($scope, $timeout, $http, glSceneService, glCameraService, glRendererService, glVideoService, glCoordService, glSocketService) {

        $scope.width = function () {
            return window.innerWidth;
        };
        $scope.height = function () {
            return window.innerHeight;
        };

        $scope.sceneHeight = function() {
            var sceneHeight = $scope.height() - angular.element("#navbar").outerHeight();
            return sceneHeight;
        };

        $scope.getVideoUrl = function() {
            var home = "http://data.3dvis.informaticslab.co.uk/molab-3dwx-ds/media/videos/latest";
            $http.get(home)
                .success(function (data, status, headers, config) {
                    var videos = data._embedded.latest_videos;
                    for (var i=0; i<videos.length; i++) {
                        if (videos[i].model === "UKV" && videos[i].phenomenon === "cloud_volume_fraction_in_atmosphere_layer") {
                            $scope.videoUrl = videos[i]._links.self.href;
                            console.log(videos[i]._links.self.href);
                        }
                    }
                    //VIDEO DATA
                    glVideoService.loadData($scope.videoUrl);
                })
                .error(function (data, status, headers, config) {
                    console.log("Data", data);
                    alert("failed to load data : " + status);
                });
        }

        $scope.getVideoUrl();
        //$scope.videoUrl = 'http://data.3dvis.informaticslab.co.uk/molab-3dwx-ds/media/5617a071e4b0e3a528b9512b';


        $scope.toggleMacro = function () {
            $scope.$broadcast('toggleMacro');
        };

        $scope.connect = function () {
            console.log("parent");
        };

        $scope.loadModal = $('#load-modal');


        /******************************
        Init objects in shared services
        *******************************/

        //SCENE
        glSceneService.scene = new THREE.Scene();
        glSceneService.scene2 = new THREE.Scene();

        //CAMERA
        var fov = 45;
        var aspect = $scope.width() / $scope.sceneHeight();
        var near = 0.01;
        var far = 10000;

        glCameraService.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        cam = glCameraService.camera;

        glCameraService.cameraNormal = new THREE.Vector3(0,0,-1);

        glCameraService.camera.position.x = 2*0;
        glCameraService.camera.position.y = 2*791;
        glCameraService.camera.position.z = 2*63;

        glCameraService.camera.lookAt(new THREE.Vector3(0, 0, 0));


        //RENDERER
        glRendererService.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
        glRendererService.renderer.setSize($scope.width(), $scope.sceneHeight());
        glRendererService.renderer.autoClear = false;
        /*
         * commented out as have set background to transparent
         */
        //glRendererService.renderer.setClearColor(0x2222ee);
        window.onload = function() {
            $('#load-modal').modal('show');
            $('.modal-backdrop').remove();
        };

        $scope.startUp = function() {
            $('#load-modal').fadeOut(2000, function() {
                $('#load-modal').remove();
                $("body").removeClass("modal-open");
            });
            $timeout(function() {
                glCameraService.moveCamera(glCameraService.defaultPosition, true);
            }, 2500);
        };

        $scope.launchClassic = function () {
            console.log("launching classic controls");
            $scope.startUp();

        };

        $scope.launchMulti = function () {
            console.log("launching multi controls");
            glSocketService.connect();
            $("#container").append($scope.loadModal[0]);
            $scope.$on('connection-code', function(event, message) {
                $("#modal-content-1").fadeOut(500, function() {
                    $("#connection-code").text(message);
                    $("#modal-content-2").fadeIn(500, function(){
                    });
                });
            });
        };

        $scope.$on('client connected', function() {
            console.log("remote client was connected");
            $scope.startUp();
            $scope.$on('tween complete', function() {

            glSocketService.send({
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
        });

        

        $scope.$on('video data loaded', function() {
            console.log("video ready");
            $scope.$broadcast('init scene');
        });

    }]);