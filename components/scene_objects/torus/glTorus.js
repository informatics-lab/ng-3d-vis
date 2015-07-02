angular.module('ngWebglDemo')
  .directive('glTorus', function() {
    return {
      restrict: 'E',
      require: "^ngWebgl",
      scope: false,
      link: function postLink(scope, element, attrs, parentCtrl) {
        function draw() {
          var geometry  = new THREE.TorusGeometry( 70, 30, 160, 200 );

          var lambert = new THREE.MeshLambertMaterial({ 
            color: colour, 
            shading: THREE.FlatShading, 
            vertexColors: THREE.VertexColors 
          });

          // Build and add the icosahedron to the scene
          var torus = new THREE.Mesh( geometry, lambert );
          torus.position.x = -200;
          torus.position.y = 200;
          torus.rotation.x = 20;
          scope.torus = torus;
          parentCtrl.addSomething(torus);
        }

        var colour = 0x006600;
        draw();
      }
    };
  });