'use strict';

angular.module('ngWebglDemo')
  .service('glBoxShaderRequestService', function($rootScope) {
    var vm = this;

    vm.fragmentLoaded = false;
    vm.vertexLoaded = false;
    vm.vertexShader = null;
    vm.fragmentShader = null;

    function onVertexLoad() {
      vm.vertexShader = this.responseText;
      vm.vertexLoaded = true;
      conditionalBroadcast();
    }

    function onFragmentLoad() {
      vm.fragmentShader = this.responseText;
      vm.fragmentLoaded = true;
      conditionalBroadcast();
    }

    vm.loadShaders = function loadShaders() {
      var vReq = new XMLHttpRequest();
      vReq.onload = onVertexLoad;
      vReq.open("get", 'components/scene_objects/box/box_vertex_shader.c', true);
      vReq.send();

      var fReq = new XMLHttpRequest();
      fReq.onload = onFragmentLoad;
      fReq.open("get", 'components/scene_objects/box/box_fragment_shader.c', true);
      fReq.send();
    }

    function conditionalBroadcast() {
      if (vm.vertexLoaded && vm.fragmentLoaded) {
        $rootScope.$broadcast('boxShadersLoaded');
        vm.vertexLoaded = false;
        vm.fragmentLoaded = false;
      }
    }

    return vm;
  });