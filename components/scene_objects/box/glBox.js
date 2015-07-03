angular.module('ngWebglDemo')
  .directive('glBox', function() {
    return {
      restrict: 'E',
      require: "^ngWebgl",
      controller: boxController,
      controllerAs: 'vm',
      scope: {},
      link: function postLink(scope, element, attrs, parentCtrl) {
        function drawBox() {
            var geometry  = new THREE.BoxGeometry( 100, 100, 100 );

            var materialbackFace = new THREE.ShaderMaterial( {
              vertexShader: scope.vm.vertexShader,
              fragmentShader: scope.vm.fragmentShader
            });

            // Build and add the icosahedron to the scene
            var box = new THREE.Mesh( geometry, materialbackFace );
            box.position.x = 250;
            box.rotation.x = 0.5;
            box.rotation.y = -0.2;
            parentCtrl.addSomething(box);
        }
        
        scope.vm.shaderService.loadShaders();
        scope.$on('boxShadersLoaded', function(){
          scope.vm.setShaders();
          drawBox();
        })
      }
    };
  });

function boxController($scope, glBoxShaderRequestService) {
  var vm = this;

  vm.shaderService = glBoxShaderRequestService;

  vm.setShaders = function() {
    vm.vertexShader = vm.shaderService.vertexShader;
    vm.fragmentShader = vm.shaderService.fragmentShader;
  }
}