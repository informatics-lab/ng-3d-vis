'use strict';

angular.module('three')
    .directive('ngWebgl', function () {
        return {
            restrict: 'E',
            scope: {
                'width': '=',
                'height': '=',
                'datashape': '='
            },
            controller: webglController,
            controllerAs: 'vm',
            link: {
                pre: function webglPreLink(scope, element, attrs) {
                    var scene = new THREE.Scene();
                    scope.scene = scene;
                    scope.vm.sceneService.scene = scene;
                },
                post: function webglPostLink(scope, element, attrs) {
                    var params = scope.vm.paramService;

                    var contW = scope.width;
                    var contH = scope.height;
                    var windowHalfX = contW / 2;
                    var windowHalfY = contH / 2;
                    scope.then = Date.now();


                    scope.init = function () {

                        scope.vm.cameraService.camera = new THREE.PerspectiveCamera(45, contW / contH, 0.01, 10000);
                        scope.vm.cameraService.camera.rotation.order = "YXZ";
                        scope.vm.cameraService.camera.position.set(scope.datashape.x * params.CAMERA_STANDOFF,
                            scope.datashape.z * params.CAMERA_STANDOFF * params.Z_SCALING * 1.1, // 1.1 fac to get rid of
                            scope.datashape.y * params.CAMERA_STANDOFF * 1.05); // geometrically perfect camera perspective
                        scope.vm.cameraService.camera.lookAt(new THREE.Vector3(0, 0, 0));
                        scope.vm.cameraService.cameraNormal = new THREE.Vector3(0,0,-1);

                        // Scene
                        var scene = scope.vm.sceneService.scene;
                        scope.vm.scene = scene;

                        // Lighting

                        var lightColor = 0xFFFFFF;
                        var dirLightIntensity = 3;
                        var dirLight = new THREE.DirectionalLight(lightColor, dirLightIntensity);
                        dirLight.position.set(0.0, 20.0, 0.0);
                        scope.vm.dirLight = dirLight;
                        scope.vm.sceneService.addSomething(dirLight);

                        // Shadow
                        var canvas = document.createElement('canvas');
                        canvas.width = 128;
                        canvas.height = 128;

                        var renderer = new THREE.WebGLRenderer({antialias: true});
                        renderer.setClearColor("rgb(135, 206, 250)", 1);
                        renderer.setSize(contW, contH);
                        scope.vm.renderer = renderer;

                        // element is provided by the angular directive
                        element[0].appendChild(renderer.domElement);

                        // trackball controls
                        scope.vm.controls = new THREE.OrbitControls(scope.vm.cameraService.camera, renderer.domElement);
                        scope.vm.controls.zoomSpeed *= 1.0;
                        // scope.vm.controls.damping = 0.5;
                        //scope.vm.controls.addEventListener( 'change', scope.render );

                        window.addEventListener('resize', scope.onWindowResize, false);

                    };

                    // -----------------------------------
                    // Event listeners
                    // -----------------------------------
                    scope.onWindowResize = function () {
                        console.log("on resize");
                        scope.resizeCanvas();

                    };

                    // -----------------------------------
                    // Updates
                    // -----------------------------------
                    scope.resizeCanvas = function () {
                        console.log("resize");
                        contW = window.innerWidth;
                        contH = window.innerHeight;

                        windowHalfX = contW / 2;
                        windowHalfY = contH / 2;

                        if (scope.vm.cameraService.camera) {
                            scope.vm.cameraService.camera.aspect = contW / contH;
                            scope.vm.cameraService.camera.updateProjectionMatrix();
                        }

                        if (scope.vm.renderer) {
                            scope.vm.renderer.setSize(contW, contH);
                        }

                    };

                    // -----------------------------------
                    // Draw and Animate
                    // -----------------------------------
                    scope.animate = function () {
                        scope.vm.broadcastRender();

                        requestAnimationFrame(scope.animate);

                        var now = Date.now();
                        var delta = now - scope.then;
                        if (delta > params.interval) {

                            // update time stuffs
                            scope.then = now - (delta % params.interval);

                            //update();
                            // scope.vm.controls.update();
                            scope.render();
                        }

                    };

                    scope.render = function () {

                        scope.vm.renderer.render(scope.vm.scene, scope.vm.cameraService.camera);
                        scope.vm.cameraService.cameraNormal.set(0, 0, -1);
                        scope.vm.cameraService.cameraNormal.applyQuaternion(scope.vm.cameraService.camera.quaternion);
                        TWEEN.update();

                    };

                    // -----------------------------------
                    // Watches
                    // -----------------------------------

                    scope.$on('videoLoaded', function () {
                        // Begin
                        scope.init();
                        scope.animate();
                    })
                }
            }
        }
    });

function webglController($scope, $rootScope, glSceneService, glSkyboxParameterService, glVideoDataModelService, glCameraService) {
    var vm = this;
    vm.dirLight = null;
    //vm.ambientLight = null;
    vm.renderer = null;

    vm.sceneService = glSceneService;
    vm.paramService = glSkyboxParameterService;
    vm.videoService = glVideoDataModelService;
    vm.cameraService = glCameraService;

    vm.addSomething = function (thing) {
        vm.sceneService.addSomething(thing);
    }
    vm.removeSomething = function (thing) {
        vm.sceneService.removeSomething(thing);
    }
    vm.broadcastRender = function () {
        $rootScope.$broadcast('render');
    }

    $rootScope.$on('socket', function (status) {
        console.log(status);
    });
}