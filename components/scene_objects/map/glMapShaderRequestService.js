'use strict';

angular.module('ngWebglDemo')
  .service('glMapShaderRequestService', function($rootScope) {
    var vm = this;
    vm.shaders_to_load = {};
    vm.loaded = {};
    vm.shaders = {};
    vm.msg = 'shadersLoaded';

    vm.setShaders = function(shader_list) {
      for (var i=0; i<Object.keys(shader_list).length; i++) {
        var shader_name = Object.keys(shader_list)[i];
        vm.loaded[shader_name] = false;
        vm.shaders[shader_name] = null;
      }
      vm.shaders_to_load = shader_list;
    }

    vm.setMessage = function(msg) {
      vm.msg = msg;
    }

    function onShaderLoad(shader_name, rq) {
      vm.shaders[shader_name] = rq.responseText;
      vm.loaded[shader_name] = true;
      conditionalBroadcast();
    }

    function mkCallback(name) {
      return function(){
        onShaderLoad(name, this);
      };
    }

    vm.loadShaders = function() {
      for (var i=0; i<Object.keys(vm.shaders_to_load).length; i++) {
        var shader_name = Object.keys(vm.shaders_to_load)[i];
        var shader_path = vm.shaders_to_load[shader_name];

        var vReq = new XMLHttpRequest();
        vReq.onload = mkCallback(shader_name);
        vReq.open("get", shader_path, true);
        vReq.send();
      }
    }

    function conditionalBroadcast() {
      var allLoaded = true;
      for (var i=0; i<Object.keys(vm.shaders_to_load).length; i++) {
        var shader_name = Object.keys(vm.shaders_to_load)[i];
        if (! vm.loaded[shader_name]) {
          allLoaded = false;
        }
      }
      if (allLoaded) {
        $rootScope.$broadcast(vm.msg);
        vm.shaders_to_load = [];
        vm.loaded = {};
        vm.shaders = {};
      }
    }

    return vm;
  });