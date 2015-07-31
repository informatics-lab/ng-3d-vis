'use strict';

angular.module('three')
    .directive('glVolumeRenderedSky', function () {
        return {
            restrict: 'E',
            require: "^glScene",
            scope: {
                'name': '@'
            },
            controller: volumeRenderedSkyController,
            controllerAs: 'vm',
            link: function postLink(scope, element, attrs, parentCtrl) {

                function setDataTexType(mipMapTex) {
                    if (mipMapTex) {
                        scope.vm.dataTexture.generateMipmaps = true;
                        scope.vm.dataTexture.magFilter = THREE.LinearFilter;
                        scope.vm.dataTexture.minFilter = THREE.LinearMipMapLinearFilter;
                    } else {
                        scope.vm.dataTexture.generateMipmaps = false;
                        scope.vm.dataTexture.magFilter = THREE.NearestFilter;
                        scope.vm.dataTexture.minFilter = THREE.NearestFilter;
                    }
                    scope.vm.dataTexture.needsUpdate = true;
                }

                function drawBox() {
                    var params = scope.vm.params;
                    var dims = scope.vm.videoService.data.data_dimensions;
                    var videoImage = scope.vm.videoService.frame;
                    var shaders = scope.vm.shaders;
                    var dirLight = parentCtrl.sceneService.children["light"];

                    var boxDims = new THREE.Vector3(dims.x,
                        dims.z * scope.vm.constants.HEIGHT_SCALE_FACTOR,
                        dims.y);
                    var boxGeometry = new THREE.BoxGeometry(boxDims.x, boxDims.y, boxDims.z); // the block to render inside
                    boxGeometry.doubleSided = true;

                    var dataTexture = new THREE.Texture(videoImage);
                    scope.vm.dataTexture = dataTexture;

                    setDataTexType(params.mipMapTex); // set mip mapping on or off

                    /*************** add aquarium outline **/
                    var boxOutlineMesh = new THREE.Mesh(boxGeometry);
                    var boxOutLine = new THREE.BoxHelper(boxOutlineMesh);
                    boxOutLine.material.color.set("#000033");
                    parentCtrl.sceneService.addSomething(scope.name + '_box', boxOutLine);

                    /*** first pass ***/
                    var materialbackFace = new THREE.ShaderMaterial({
                        vertexShader: shaders.vertex_shader_screen_proj,
                        fragmentShader: shaders.fragment_shader_back_face,
                        side: THREE.BackSide,
                        uniforms: {
                            dimensions: {type: "v3", value: boxDims},
                            cameraNormal: {type: "v3", value: parentCtrl.cameraService.cameraNormal}
                        }
                    });

                    var meshBackFace = new THREE.Mesh(boxGeometry, materialbackFace);

                    var sceneBackFace = new THREE.Scene();
                    sceneBackFace.add(meshBackFace);
                    scope.vm.sceneBackFace = sceneBackFace;

                    // get the "colour" coords we just made, as a texture
                    var backFaceTexture = new THREE.WebGLRenderTarget(window.innerWidth / params.downScaling,
                        window.innerHeight / params.downScaling,
                        {
                            minFilter: THREE.NearestFilter,
                            magFilter: THREE.NearestFilter,
                            format: THREE.RGBFormat,
                            type: THREE.FloatType
                        });
                    scope.vm.backFaceTexture = backFaceTexture;
                    backFaceTexture.wrapS = backFaceTexture.wrapT = THREE.ClampToEdgeWrapping;

                    /*** second pass ***/
                    var uniforms = {
                        backFaceTexture: {type: "t", value: backFaceTexture},
                        dataTexture: {type: "t", value: scope.vm.dataTexture},
                        lightPosition: {type: "v3", value: dirLight.position},
                        lightColor: {
                            type: "v3",
                            value: {x: dirLight.color.r, y: dirLight.color.g, z: dirLight.color.b}
                        },
                        lightIntensity: {type: "1f", value: dirLight.intensity},
                        cameraNormal: {type: "v3", value: parentCtrl.cameraService.cameraNormal},
                        steps: {type: "1f", value: params.nSteps}, // so we know how long to make in incriment
                        shadeSteps: {type: "1f", value: params.shadeSteps},
                        alphaCorrection: {type: "1f", value: params.alphaCorrection},
                        ambience: {type: "1f", value: params.ambience},
                        dataShape: {type: "v3", value: dims.datashape},
                        texShape: {type: "v2", value: dims.textureshape},
                        dimensions: {type: "v3", value: boxDims}
                    };

                    var materialRayMarch = new THREE.ShaderMaterial({
                        vertexShader: shaders.vertex_shader_screen_proj,
                        fragmentShader: shaders.fragment_shader_ray_march,
                        uniforms: uniforms
                    });
                    materialRayMarch.transparent = true;

                    var meshRayMarch = new THREE.Mesh(boxGeometry, materialRayMarch);

                    parentCtrl.sceneService.addSomething(scope.name, meshRayMarch);

                }

                function conditionalBroadcast() {
                    if (scope.vm.gotShaders && scope.vm.gotVideo) {
                        scope.$broadcast('skyboxReady');
                        scope.vm.gotShaders = false;
                        scope.vm.gotVideo = false;
                    }
                }

                scope.vm.fetchShaders();
                scope.$on('shadersLoaded', function () {
                    scope.vm.setShaders();
                    scope.vm.gotShaders = true;
                    conditionalBroadcast();
                })
                scope.$on('videoLoaded', function () {
                    scope.vm.setVideoImage();
                    scope.vm.gotVideo = true;
                    conditionalBroadcast();
                })
                scope.$on('skyboxReady', function () {
                    drawBox();
                })
                scope.$on('render', function () {
                    if (scope.vm.ready) {
                        //scope.vm.dataTexture.needsUpdate = true;
                        parentCtrl.rendererService.renderer.render(scope.vm.sceneBackFace, parentCtrl.cameraService.camera, scope.vm.backFaceTexture, true);
                    }
                })
                scope.$on('videoUpdate', function () {
                    scope.vm.dataTexture.needsUpdate = true;
                })

            }
        };
    });

function volumeRenderedSkyController($scope, glShaderRequestService, glVideoService, glConstantsService) {
    var vm = this;

    vm.shaderService = glShaderRequestService;
    vm.videoService = glVideoService;
    vm.constants = glConstantsService;

    //ported from glSkyboxParameterService
    vm.params = {
        nSteps : 64,
        shadeSteps : 16,
        opacFac : 4.0,
        alphaCorrection : 4 / 64, //opacFac / nSteps
        mipMapTex : false,
        downScaling : 1,
        play : true,
        ambience : 0.3
    };

    vm.fetchShaders = function () {
        var shader_root = '../../components/scene_objects/skybox/shaders/';
        vm.shaderService.setShaders(
            {
                fragment_shader_back_face: shader_root + 'fragment_shader_back_face.glsl',
                fragment_shader_ray_march: shader_root + 'fragment_shader_ray_march.glsl',
                vertex_shader_screen_proj: shader_root + 'vertex_shader_screen_proj.glsl',
            });
        vm.shaderService.loadShaders();
    }

    vm.setShaders = function () {
        vm.shaders = vm.shaderService.shaders;
    }

}