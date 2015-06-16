angular.module('ngWebglDemo')
  .directive('glBox', function() {
    return {
      restrict: 'E',
      require: "^ngWebgl",
      link: function postLink(scope, element, attrs, parentCtrl) {
        function drawBox() {
            var geometry  = new THREE.BoxGeometry( 100, 100, 100 );

            // var materialbackFace = new THREE.ShaderMaterial( {
            //   vertexShader: document.getElementById( 'vertexShaderBackFace' ).textContent,
            //   fragmentShader: document.getElementById( 'fragmentShaderBackFace' ).textContent
            // });
            var materialbackFace = new THREE.ShaderMaterial( {
              vertexShader: scope.vertexShader,
              fragmentShader: scope.fragmentShader
            });

            var lambert = new THREE.MeshLambertMaterial({ 
              color: 0xff00ff, 
              shading: THREE.FlatShading, 
              vertexColors: THREE.VertexColors 
            });

            // Build and add the icosahedron to the scene
            var box = new THREE.Mesh( geometry, materialbackFace );
            box.position.x = 250;
            box.rotation.x = 0.5;
            box.rotation.y = -0.2;
            parentCtrl.addSomething(box);
        }

        function loadShaders() {
            scope.fragmentLoaded = false;
            scope.vertexLoaded = false;
            scope.vertexShader = null;
            scope.fragmentShader = null;
            function onVertexLoad() {
              scope.vertexShader = this.responseText;
              scope.$broadcast('vertexLoad');
            }
            function onFragmentLoad() {
              scope.fragmentShader = this.responseText;
              scope.$broadcast('fragmentLoad');
            }

            var vReq = new XMLHttpRequest();
            vReq.onload = onVertexLoad;
            vReq.open("get", 'components/scene_objects/box/box_vertex_shader.c', true);
            vReq.send();

            var fReq = new XMLHttpRequest();
            fReq.onload = onFragmentLoad;
            fReq.open("get", 'components/scene_objects/box/box_fragment_shader.c', true);
            fReq.send();

            function conditionalBroadcast() {
              if (scope.vertexLoaded && scope.fragmentLoaded) {
                scope.$broadcast('shadersLoaded');
              }
            }
            scope.$on('vertexLoad', function(){
              scope.vertexLoaded = true;
              conditionalBroadcast();
            })
            scope.$on('fragmentLoad', function(){
              scope.fragmentLoaded = true;
              conditionalBroadcast();
            })
            scope.$on('shadersLoaded', function(){
              drawBox();
            })
        }
        loadShaders();
      }
    };
  });