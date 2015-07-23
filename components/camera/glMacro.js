angular.module('three')
  .directive('glMacro', function() {
    return {
      restrict: 'E',
      require: "^ngWebgl",
      controller: macroController,
      controllerAs: 'vm',
      link: function (scope, element, attrs, parentCtrl) {
        scope.vm.loadDefaultMacro();
      }
    };
  });

function macroController($scope, glCameraService) {
  var vm = this;

  vm.cameraService = glCameraService;

  vm.play_macro = false; // for camera macro
  vm.record_macro = false; // for camera macro
  vm.macro_frame = 0;
  vm.cameraMacro = [];

  vm.loadDefaultMacro = function() {
    $.getJSON("../../components/camera/cameraMacro.json", function(data){
        for (i=0; i<data.length; i++){
            var thispos = data[i].position;
            var thisdir = data[i].direction;
            vm.cameraMacro.push({"position": new THREE.Vector3(thispos.x, thispos.y, thispos.z),
                              "direction": new THREE.Quaternion(thisdir._x, thisdir._y, thisdir._z, thisdir._w)})
        }
    });
  }

  vm.toggleMacro = function() {
    vm.play_macro = !vm.play_macro;
  }

  vm.recordMacro = function() {
    vm.record_macro = true;
  }

  vm.clearMacro = function() {
    vm.cameraMacro = [];
  }

  vm.saveMacro = function() {
    localStorage["cameraMacro"] = vm.cameraMacro;
  }

  $scope.$on('render', function(){
    if (vm.record_macro) {
        vm.cameraMacro.push({"position": vm.cameraService.camera.getWorldPosition(),
                          "direction": vm.cameraService.camera.getWorldQuaternion()});
    }

    if (vm.play_macro && vm.cameraMacro.length != 0) {
        var this_pos = vm.cameraMacro[vm.macro_frame].position;
        vm.cameraService.camera.position.set(this_pos.x, this_pos.y, this_pos.z);
        vm.cameraService.camera.setRotationFromQuaternion(vm.cameraMacro[vm.macro_frame].direction);
        vm.cameraService.camera.updateProjectionMatrix();

        vm.macro_frame < (vm.cameraMacro.length-1) ? vm.macro_frame++ : vm.macro_frame=0;
    }
  })

  $scope.$on('toggleMacro', function() {
    vm.toggleMacro();
  })
}