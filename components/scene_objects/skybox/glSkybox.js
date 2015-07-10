angular.module('ngWebglDemo')
  .directive('glSkybox', function() {
    return {
      restrict: 'E',
      require: "^ngWebgl",
      controller: skyboxController,
      controllerAs: 'vm',
      link: postLink
    };
  });

function postLink(scope, element, attrs, parentCtrl) {

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
      var dims = scope.vm.videoDims;
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
          vertexShader: shaders.vertex_shader_back_face,
          fragmentShader: shaders.fragment_shader_back_face,
          side: THREE.BackSide,
          uniforms: {dimensions: {type: "v3", value: boxDims}}
      });

      var meshBackFace = new THREE.Mesh( boxGeometry, materialbackFace );
      
      var sceneBackFace = new THREE.Scene();
      sceneBackFace.add( meshBackFace );
      scope.vm.sceneBackFace = sceneBackFace;
      
      // get the "colour" coords we just made, as a texture
      var backFaceTexture = new THREE.WebGLRenderTarget(  window.innerWidth/params.downScaling,
                                                       window.innerHeight/params.downScaling,
                                               { minFilter: THREE.NearestFilter,
                                                 magFilter: THREE.NearestFilter,
                                                 format: THREE.RGBFormat,
                                                 type: THREE.FloatType } );
      scope.vm.backFaceTexture = backFaceTexture;
      backFaceTexture.wrapS = backFaceTexture.wrapT = THREE.ClampToEdgeWrapping;    
      
      /*** second pass ***/
      var uniforms = { backFaceTexture: { type: "t", value: backFaceTexture },
                           dataTexture: { type: "t", value: scope.vm.dataTexture },
                           lightPosition: { type: "v3", value: dirLight.position},
                           lightColor: { type: "v3", value: {x: dirLight.color.r, y:dirLight.color.g, z:dirLight.color.b}},
                           lightIntensity: {type: "1f", value: dirLight.intensity},
                           steps : {type: "1f" , value: params.nSteps}, // so we know how long to make in incriment 
                           shadeSteps : {type: "1f" , value: params.shadeSteps},
                           alphaCorrection : {type: "1f" , value: params.alphaCorrection },
                           ambience : {type: "1f", value: params.ambience},
                           dataShape: {type: "v3", value: dims.datashape},
                           texShape: {type: "v2", value: dims.textureshape},
                           dimensions: {type: "v3", value: boxDims}
                       };

      var materialRayMarch = new THREE.ShaderMaterial( {
          vertexShader: shaders.vertex_shader_ray_march,
          fragmentShader: shaders.fragment_shader_ray_march,
          side: THREE.FrontSide,
          uniforms: uniforms
      });
      // materialRayMarch.transparent = true;
      
      var sceneRayMarch = new THREE.Scene();
      var meshRayMarch = new THREE.Mesh( boxGeometry, materialRayMarch );
      sceneRayMarch.add( meshRayMarch );
      scope.vm.sceneRayMarch = sceneRayMarch;

      var rayMarchTexture = new THREE.WebGLRenderTarget(  window.innerWidth/params.downScaling,
                                                       window.innerHeight/params.downScaling,
                                               { minFilter: THREE.LinearFilter,
                                                 magFilter: THREE.LinearFilter,
                                                 format: THREE.RGBAFormat,
                                                 type: THREE.FloatType } );
      scope.vm.rayMarchTexture = rayMarchTexture;
      rayMarchTexture.wrapS = rayMarchTexture.wrapT = THREE.ClampToEdgeWrapping;

      /*************** Resample ray marching ****/
      var uniforms2 = {rayMarchTexture: {type: "t", value: rayMarchTexture}};
      materialResampledRayMarch = new THREE.ShaderMaterial( {
          vertexShader: shaders.vertex_shader_resample,
          fragmentShader: shaders.fragment_shader_resample,
          side: THREE.FrontSide,
          uniforms: uniforms2
      });
      materialResampledRayMarch.transparent = true;
      var meshResampledRayMarch = new THREE.Mesh( boxGeometry, materialResampledRayMarch );

      parentCtrl.addSomething(meshResampledRayMarch);

      
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
    scope.vm.setVideoDims();
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
      parentCtrl.renderer.render( scope.vm.sceneRayMarch, parentCtrl.cameraService.camera, scope.vm.rayMarchTexture, true );
    }
  })
  scope.$on('videoUpdate', function() {
    scope.vm.dataTexture.needsUpdate = true;
  })

}

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
    var shader_root = 'components/scene_objects/skybox/shaders/';
    vm.shaderService.setShaders(
      {
        fragment_shader_back_face: shader_root+'fragment_shader_back_face.c',
        vertex_shader_back_face: shader_root+'vertex_shader_back_face.c',
        fragment_shader_ray_march: shader_root+'fragment_shader_ray_march.c',
        vertex_shader_ray_march: shader_root+'vertex_shader_ray_march.c',
        fragment_shader_resample: shader_root+'fragment_shader_resample.c',
        vertex_shader_resample: shader_root+'vertex_shader_resample.c'
      });
    vm.shaderService.loadShaders();
  }

  vm.setShaders = function() {
    vm.shaders = vm.shaderService.shaders;
  }

  vm.setVideoDims = function() {
    vm.videoDims = vm.videoService.videoDims;
  }

  vm.setVideoImage = function() {
    vm.videoImage = vm.videoService.videoImage;
  }
}