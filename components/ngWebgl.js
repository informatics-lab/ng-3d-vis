'use strict';

angular.module('ngWebglDemo')
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
                          scope.vm.sceneService.setScene(scene);
                      },
                post: function webglPostLink(scope, element, attrs) {
                          var params = scope.vm.paramService;

                          var contW = scope.width;
                          var contH = scope.height;
                          var windowHalfX = contW / 2;
                          var windowHalfY = contH / 2;
                          scope.then = Date.now();


                          scope.init = function () {
                              scope.vm.cameraService.setupCamera(
                                  contW / contH, params.CAMERA_STANDOFF, params.Z_SCALING, scope.datashape
                              );

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
                              scope.resizeCanvas();
                              //THREEx.WindowResize(renderer, camera);

                          };

                          // -----------------------------------
                          // Updates
                          // -----------------------------------
                          scope.resizeCanvas = function () {

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
                              scope.vm.cameraService.cameraNormal.set(0,0,-1);
                              scope.vm.cameraService.cameraNormal.applyQuaternion(scope.vm.cameraService.camera.quaternion);
                              TWEEN.update();
                              //scope.vm.broadcastRender();

                          };

                          // -----------------------------------
                          // Watches
                          // -----------------------------------
                          scope.$watch('width + height', function () {

                              scope.resizeCanvas();

                          });

                          scope.$on('videoLoaded', function () {
                              // Begin
                              scope.init();
                              scope.animate();
                          })
                      }
            }
        }
    });

function webglController($scope, $rootScope, glSceneService, glSkyboxParameterService, glVideoDataModelService, glCameraModelService) {
    var vm = this;
    vm.dirLight = null;
    //vm.ambientLight = null;
    vm.renderer = null;

    vm.sceneService = glSceneService;
    vm.paramService = glSkyboxParameterService;
    vm.videoService = glVideoDataModelService;
    vm.cameraService = glCameraModelService;

    vm.addSomething = function (thing) {
        vm.sceneService.addSomething(thing);
    }
    vm.removeSomething = function (thing) {
        vm.sceneService.removeSomething(thing);
    }
    vm.broadcastRender = function () {
        $rootScope.$broadcast('render');
    }

    vm.grid_dims = {x:1261, z:1506};
    vm.geo_bounds = [
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

    vm.moveCamera = function(pos) {
        var tween = new TWEEN.Tween(vm.cameraService.camera.position).to(
            {x: pos.x, y: pos.y, z: pos.z},
            3000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function () {
            }).onComplete(function () {
            }).start();
    }
}