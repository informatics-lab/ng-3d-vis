angular.module('ngWebglDemo')
  .directive('glSphere', function($timeout) {
    return {
      restrict: 'E',
      require: "^ngWebgl",
      scope: {
        'radius': '=',
        'res': '=',
        'pos': '=',
        'rot': '='
      },
      link: function postLink(scope, element, attrs, parentCtrl) {

        function draw() {
          var geometry = new THREE.SphereGeometry( scope.radius, scope.res[0], scope.res[1] );

          var lambert = new THREE.MeshLambertMaterial({ 
            color: scope.colour, 
            shading: THREE.FlatShading, 
            vertexColors: THREE.VertexColors 
          });

          // Build and add the icosahedron to the scene
          var sphere = new THREE.Mesh( geometry, lambert );
          sphere.position.set(scope.pos[0], scope.pos[1], scope.pos[2]);
          sphere.rotation.set(scope.rot[0], scope.rot[1], scope.rot[2]);
          scope.sphere = sphere;
          parentCtrl.addSomething(sphere);
        }

        function undraw() {
          parentCtrl.removeSomething(scope.sphere);
        }

        scope.$on('update', function() {
          $timeout(function(){
              //any code in here will automatically have an apply run afterwards
              undraw();
              draw(0xffff00);
          });
        })

        scope.colour = 0xffff00;
        draw();
      }
    };
  });