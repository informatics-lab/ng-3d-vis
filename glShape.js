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
          var geometry  = new THREE.SphereGeometry( scope.radius, scope.res[0], scope.res[1] );

          var lambert = new THREE.MeshLambertMaterial({ 
            color: 0xffff00, 
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
              draw();
          });
        })
        draw();
      }
    };
  });

angular.module('ngWebglDemo')
  .directive('glBox', function() {
    return {
      restrict: 'E',
      require: "^ngWebgl",
      link: function postLink(scope, element, attrs, parentCtrl) {
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
        parentCtrl.addSomething(box);
      }
    };
  });

  angular.module('ngWebglDemo')
  .directive('glTorus', function() {
    return {
      restrict: 'E',
      require: "^ngWebgl",
      link: function postLink(scope, element, attrs, parentCtrl) {
        var geometry  = new THREE.TorusGeometry( 70, 30, 160, 200 );

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
        parentCtrl.addSomething(torus);
      }
    };
  });