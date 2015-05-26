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
        scope.vm.addSomething(box);
      }
    };
  });

  angular.module('ngWebglDemo')
  .directive('glCircle', function() {
    return {
      restrict: 'A',
      controller: shapeController,
      controllerAs: 'vm',
      link: function postLink(scope, element, attrs) {
        var geometry  = new THREE.CircleGeometry( 30, 20 );

        var lambert = new THREE.MeshLambertMaterial({ 
          color: 0x006600, 
          shading: THREE.FlatShading, 
          vertexColors: THREE.VertexColors 
        });

        // Build and add the icosahedron to the scene
        var circle = new THREE.Mesh( geometry, lambert );
        circle.position.y = 250;
        scope.vm.addSomething(circle);
      }
    };
  });