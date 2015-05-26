angular.module('ngWebglDemo')
  .directive('glSphere', function() {
    return {
      restrict: 'A',
      controller: shapeController,
      controllerAs: 'vm',
      link: function postLink(scope, element, attrs) {
        var geometry  = new THREE.SphereGeometry( 150, 10, 10 );

        var lambert = new THREE.MeshLambertMaterial({ 
          color: 0xffff00, 
          shading: THREE.FlatShading, 
          vertexColors: THREE.VertexColors 
        });

        // Build and add the icosahedron to the scene
        var sphere = new THREE.Mesh( geometry, lambert );
        sphere.position.x = 0;
        sphere.rotation.x = 0;
        scope.vm.addSomething(sphere);
      }
    };
  });

function shapeController(glSceneService) {
  var vm = this;

  vm.sceneService = glSceneService;
  vm.addSomething = function (thing) {
    vm.sceneService.addSomething(thing);
  }
}

angular.module('ngWebglDemo')
  .directive('glBox', function() {
    return {
      restrict: 'A',
      controller: shapeController,
      controllerAs: 'vm',
      link: function postLink(scope, element, attrs) {
        var geometry  = new THREE.BoxGeometry( 100, 100, 100 );

        var lambert = new THREE.MeshLambertMaterial({ 
          color: 0xff00ff, 
          shading: THREE.FlatShading, 
          vertexColors: THREE.VertexColors 
        });

        // Build and add the icosahedron to the scene
        var box = new THREE.Mesh( geometry, lambert );
        box.position.x = 250;
        box.rotation.x = 0.5;
        box.rotation.y = -0.2;
        scope.vm.addSomething(box);
      }
    };
  });

  angular.module('ngWebglDemo')
  .directive('glTorus', function() {
    return {
      restrict: 'A',
      controller: shapeController,
      controllerAs: 'vm',
      link: function postLink(scope, element, attrs) {
        var geometry  = new THREE.TorusGeometry( 70, 30, 16, 100 );

        var lambert = new THREE.MeshLambertMaterial({ 
          color: 0x006600, 
          shading: THREE.FlatShading, 
          vertexColors: THREE.VertexColors 
        });

        // Build and add the icosahedron to the scene
        var torus = new THREE.Mesh( geometry, lambert );
        torus.position.x = -200;
        torus.position.y = 200;
        torus.rotation.x = 20;
        scope.vm.addSomething(torus);
      }
    };
  });