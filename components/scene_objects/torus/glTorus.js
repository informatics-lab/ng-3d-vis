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

        function undraw() {
          parentCtrl.removeSomething(scope.torus);
        }

        function changeColour() {
          colour = (colour == 0x006600 ? 0x660000 : 0x006600);
        }

        scope.$on('render', function() {
          // torus changes colour and is redrawn on every 
          // render call - slows things down a lot

          // changeColour();
          // undraw();
          // draw();
        })

        var colour = 0x006600;
        draw();
      }
    };
  });