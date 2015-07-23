angular.module('three')
  .directive('glSkybox', function() {
    return {
      restrict: 'E',
      require: "^ngWebgl",
      controller: skyboxController,
      controllerAs: 'vm',
      link: function postLink(scope, element, attrs, parentCtrl) {

                function setDataTexType(mipMapTex){
                  if (mipMapTex){
                          scope.vm.dataTexture.generateMipmaps = true;
                          scope.vm.dataTexture.magFilter = THREE.LinearFilter;
                          scope.vm.dataTexture.minFilter = THREE.LinearMipMapLinearFilter;
                  }else{
                          scope.vm.dataTexture.generateMipmaps = false;
                          scope.vm.dataTexture.magFilter = THREE.NearestFilter;
                          scope.vm.dataTexture.minFilter = THREE.NearestFilter;
                  };
                  scope.vm.dataTexture.needsUpdate = true;
                }

                function drawBox() {
                    var params = scope.vm.paramService;
                    var dims = scope.dims;
                    var videoImage = scope.vm.videoImage;
                    var shaders = scope.vm.shaders;
                    var dirLight = parentCtrl.dirLight;

                    var boxDims = new THREE.Vector3(dims.datashape.x ,
                                                  dims.datashape.z*params.Z_SCALING,
                                                  dims.datashape.y);
                    var boxGeometry = new THREE.BoxGeometry(boxDims.x, boxDims.y, boxDims.z); // the block to render inside
                    boxGeometry.doubleSided = true;

                    var dataTexture = new THREE.Texture( videoImage );
                    scope.vm.dataTexture = dataTexture;

                    setDataTexType(params.mipMapTex); // set mip mapping on or off

                    /*************** add aquarium outline **/
                    var boxOutlineMesh = new THREE.Mesh( boxGeometry );
                    var boxOutLine = new THREE.BoxHelper( boxOutlineMesh );
                    boxOutLine.material.color.set( "#000033" );
                    parentCtrl.addSomething( boxOutLine );

                     /*** first pass ***/
                    var materialbackFace = new THREE.ShaderMaterial( {
                          vertexShader: shaders.vertex_shader_screen_proj,
                          fragmentShader: shaders.fragment_shader_back_face,
                          side: THREE.BackSide,
                          uniforms: {dimensions: {type: "v3", value: boxDims},
                                     cameraNormal: {type: "v3", value: parentCtrl.cameraService.cameraNormal}}
                      });

                    var meshBackFace = new THREE.Mesh( boxGeometry, materialbackFace );
                    
                    sceneBackFace = new THREE.Scene();
                    sceneBackFace.add( meshBackFace );
                    scope.vm.sceneBackFace = sceneBackFace;
                    
                    // get the "colour" coords we just made, as a texture
                    backFaceTexture = new THREE.WebGLRenderTarget(  window.innerWidth/params.downScaling,
                                                                     window.innerHeight/params.downScaling,
                                                             { minFilter: THREE.NearestFilter,
                                                               magFilter: THREE.NearestFilter,
                                                               format: THREE.RGBFormat,
                                                               type: THREE.FloatType } );
                    scope.vm.backFaceTexture = backFaceTexture;
                    backFaceTexture.wrapS = backFaceTexture.wrapT = THREE.ClampToEdgeWrapping;    
                    
                    /*** second pass ***/
                    uniforms = { backFaceTexture: { type: "t", value: backFaceTexture },
                                         dataTexture: { type: "t", value: scope.vm.dataTexture },
                                         lightPosition: { type: "v3", value: dirLight.position},
                                         lightColor: { type: "v3", value: {x: dirLight.color.r, y:dirLight.color.g, z:dirLight.color.b}},
                                         lightIntensity: {type: "1f", value: dirLight.intensity},
                                         cameraNormal: {type: "v3", value: parentCtrl.cameraService.cameraNormal},
                                         steps : {type: "1f" , value: params.nSteps}, // so we know how long to make in incriment 
                                         shadeSteps : {type: "1f" , value: params.shadeSteps},
                                         alphaCorrection : {type: "1f" , value: params.alphaCorrection },
                                         ambience : {type: "1f", value: params.ambience},
                                         dataShape: {type: "v3", value: dims.datashape},
                                         texShape: {type: "v2", value: dims.textureshape},
                                         dimensions: {type: "v3", value: boxDims}
                                     };

                    materialRayMarch = new THREE.ShaderMaterial( {
                        vertexShader: shaders.vertex_shader_screen_proj,
                        fragmentShader: shaders.fragment_shader_ray_march,
                        uniforms: uniforms
                    });
                    materialRayMarch.transparent = true;
                    
                    scene = new THREE.Scene();
                    scope.vm.scene = scene;
                    var meshRayMarch = new THREE.Mesh( boxGeometry, materialRayMarch );
                  
                    parentCtrl.addSomething(meshRayMarch);
                                
                    scope.vm.ready = true;
                }

                function conditionalBroadcast() {
                  if (scope.vm.gotShaders && scope.vm.gotVideo) {
                    scope.$broadcast('skyboxReady');
                    scope.vm.gotShaders = false;
                    scope.vm.gotVideo = false;
                  }
                }
                
                scope.vm.fetchShaders();
                scope.$on('shadersLoaded', function() {
                  scope.vm.setShaders();
                  scope.vm.gotShaders = true;
                  conditionalBroadcast();
                })
                scope.$on('videoLoaded', function() {
                  scope.vm.setVideoImage();
                  scope.vm.gotVideo = true;
                  conditionalBroadcast();
                })
                scope.$on('skyboxReady', function() {
                  drawBox();
                })
                scope.$on('render', function() {
                  if (scope.vm.ready) {
                    //scope.vm.dataTexture.needsUpdate = true;
                    parentCtrl.renderer.render( scope.vm.sceneBackFace, parentCtrl.cameraService.camera, scope.vm.backFaceTexture, true);
                  }
                })
                scope.$on('videoUpdate', function() {
                  scope.vm.dataTexture.needsUpdate = true;
                })

              },
      scope: {
        'dims': '='
      }
    };
  });

function skyboxController($scope, glShaderRequestService, glVideoDataModelService, glSkyboxParameterService) {
  var vm = this;

  vm.ready = false;

  vm.gotShaders = false;
  vm.gotVideo = false;

  vm.shaderService = glShaderRequestService;
  vm.videoService = glVideoDataModelService;
  vm.paramService = glSkyboxParameterService;

  vm.shaders = null;
  vm.videoDims = null;
  vm.videoImage = null;

  vm.fetchShaders = function() {
    var shader_root = '../../components/scene_objects/skybox/shaders/';
    vm.shaderService.setShaders(
      {
        fragment_shader_back_face: shader_root+'fragment_shader_back_face.glsl',
        fragment_shader_ray_march: shader_root+'fragment_shader_ray_march.glsl',
        vertex_shader_screen_proj: shader_root+'vertex_shader_screen_proj.glsl',
      });
    vm.shaderService.loadShaders();
  }

  vm.setShaders = function() {
    vm.shaders = vm.shaderService.shaders;
  }

  vm.setVideoImage = function() {
    vm.videoImage = vm.videoService.videoImage;
  }
}