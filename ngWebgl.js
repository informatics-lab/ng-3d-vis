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

    var camera, scene, renderer,
      shadowMesh, icosahedron, light,
      mouseX = 0, mouseY = 0,
      contW = (scope.fillcontainer) ? 
        element[0].clientWidth : scope.width,
      contH = scope.height, 
      windowHalfX = contW / 2,
      windowHalfY = contH / 2,
      materials = {};


    scope.init = function () {

      // Camera
      camera = new THREE.PerspectiveCamera( 20, contW / contH, 1, 10000 );
      camera.position.z = 1800;

      // Scene
      // scene = new THREE.Scene();
      // scope.scene = scene;
      // scope.vm.sceneService.setScene(scene);
      scene = scope.vm.sceneService.scene;

      // Lighting
      light = new THREE.DirectionalLight( 0xffffff );
      light.position.set( 0, 0, 1 );
      //scene.add( light );
      scope.vm.sceneService.addSomething(light);

      // Shadow
      var canvas = document.createElement( 'canvas' );
      canvas.width = 128;
      canvas.height = 128;

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setClearColor( 0xffffff );
      renderer.setSize( contW, contH );

      // element is provided by the angular directive
      element[0].appendChild( renderer.domElement );

      document.addEventListener( 'mousemove', scope.onDocumentMouseMove, false );

      window.addEventListener( 'resize', scope.onWindowResize, false );

    };

    // -----------------------------------
    // Event listeners
    // -----------------------------------
    scope.onWindowResize = function () {

      scope.resizeCanvas();

    };

    scope.onDocumentMouseMove = function ( event ) {

      mouseX = ( event.clientX - windowHalfX );
      mouseY = ( event.clientY - windowHalfY );

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

      scope.render();

    };

    scope.render = function () {

      camera.position.x += ( mouseX - camera.position.x ) * 0.05;
      // camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

      camera.lookAt( scene.position );

      renderer.render( scene, camera );

    };

    // -----------------------------------
    // Watches
    // -----------------------------------
    scope.$watch('fillcontainer + width + height', function () {

      scope.resizeCanvas();
    
    });

    // Begin
    scope.init();
    scope.animate();
};

function webglController($scope, glSceneService) {
  var vm = this;

  vm.sceneService = glSceneService;
  vm.addSomething = function (thing) {
    vm.sceneService.addSomething(thing);
  }
  vm.removeSomething = function (thing) {
    vm.sceneService.removeSomething(thing);
  }
}