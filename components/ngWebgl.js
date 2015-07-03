'use strict';

angular.module('ngWebglDemo')
  .directive('ngWebgl', function () {
    return {
      restrict: 'E',
      scope: { 
        'width': '=',
        'height': '=',
        'fillcontainer': '='
      },
      controller: webglController,
      controllerAs: 'vm',
      link: {
        pre: webglPreLink,
        post: webglPostLink
      }
    }
  });

function webglPreLink(scope, element, attrs) {
    var scene = new THREE.Scene();
    scope.scene = scene;
    scope.vm.sceneService.setScene(scene);
}

function webglPostLink(scope, element, attrs) {
    var params = scope.vm.paramService;

    var camera, scene, renderer,
      shadowMesh, icosahedron, light,
      mouseX = 0, mouseY = 0,
      contW = (scope.fillcontainer) ? 
        element[0].clientWidth : scope.width,
      contH = scope.height, 
      windowHalfX = contW / 2,
      windowHalfY = contH / 2,
      materials = {};
    scope.then = Date.now();


    scope.init = function () {
      var dims = scope.vm.videoService.videoDims;

      // Camera
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
      camera.rotation.order = "YXZ";
      camera.position.set(dims.datashape.x * params.CAMERA_STANDOFF,
                          dims.datashape.z * params.CAMERA_STANDOFF * params.Z_SCALING * 1.1, // 1.1 fac to get rid of 
                          dims.datashape.y * params.CAMERA_STANDOFF * 1.05); // geometrically perfect camera perspective
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      scope.vm.camera = camera;

      // Scene
      scene = scope.vm.sceneService.scene;
      scope.vm.scene = scene;

      // Lighting

      var lightColor = 0xFFFFFF;
      var dirLightIntensity = 3;
      var dirLight = new THREE.DirectionalLight(lightColor, dirLightIntensity);
      dirLight.position.set(0.0, 20.0, 0.0);
      scope.vm.dirLight = dirLight;
      scope.vm.sceneService.addSomething(dirLight);

      // Shadow
      var canvas = document.createElement( 'canvas' );
      canvas.width = 128;
      canvas.height = 128;

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setClearColor( 0xeeeeff );
      renderer.setSize( contW, contH );
      scope.vm.renderer = renderer;

      // element is provided by the angular directive
      element[0].appendChild( renderer.domElement );

      //document.addEventListener( 'mousemove', scope.onDocumentMouseMove, false );
      // trackball controls
      scope.vm.controls = new THREE.OrbitControls(camera) 
      scope.vm.controls.zoomSpeed *= 1.0;

      window.addEventListener( 'resize', scope.onWindowResize, false );

    };

    // -----------------------------------
    // Event listeners
    // -----------------------------------
    scope.onWindowResize = function () {

      scope.resizeCanvas();

    };

    // -----------------------------------
    // Updates
    // -----------------------------------
    scope.resizeCanvas = function () {

      contW = (scope.fillcontainer) ? 
        element[0].clientWidth : scope.width;
      contH = scope.height;

      windowHalfX = contW / 2;
      windowHalfY = contH / 2;

      camera.aspect = contW / contH;
      camera.updateProjectionMatrix();

      renderer.setSize( contW, contH );

    };
    // -----------------------------------
    // Draw and Animate
    // -----------------------------------
    scope.animate = function () {

      requestAnimationFrame( scope.animate );

      var now = Date.now();
      var delta = now - scope.then;
      if (delta > params.interval) {
          scope.vm.controls.update(delta);
          // update time stuffs
          scope.then = now - (delta % params.interval);
           
          //update();
          scope.render();
      }

    };

    scope.render = function () {

      renderer.render( scene, camera );

      scope.vm.broadcastRender();

    };

    // -----------------------------------
    // Watches
    // -----------------------------------
    scope.$watch('fillcontainer + width + height', function () {

      scope.resizeCanvas();
    
    });

    scope.$on('videoLoaded', function() {
      // Begin
      scope.init();
      scope.animate();
    })
};

function webglController($scope, $rootScope, glSceneService, glSkyboxParameterService, glVideoDataModelService) {
  var vm = this;
  vm.dirLight = null;
  //vm.ambientLight = null;
  vm.renderer = null;
  vm.camera = null;

  vm.sceneService = glSceneService;
  vm.paramService = glSkyboxParameterService;
  vm.videoService = glVideoDataModelService;

  vm.addSomething = function (thing) {
    vm.sceneService.addSomething(thing);
  }
  vm.removeSomething = function (thing) {
    vm.sceneService.removeSomething(thing);
  }
  vm.broadcastRender = function() {
    $rootScope.$broadcast('render');
  }
}