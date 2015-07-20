angular.module('ngWebglDemo')
  .directive('glMap', function() {
    return {
      restrict: 'E',
      require: "^ngWebgl",
      scope: {
        'datashape': '=',
        'zscaling': '='
      },
      controller: mapController,
      controllerAs: 'vm',
      link: function postLink(scope, element, attrs, parentCtrl) {
        function buildLand() {

          var ambientLight = new THREE.AmbientLight( 0xffffff );
          var pointLight = new THREE.PointLight( 0xffffff, 0.0 );
          pointLight.position.set(0, 300, -200);

          var ambient = 0x000000, diffuse = 0x666666, specular = 0xffffff, shininess = 50.0, scale = 100;

          //var htMapPng = 'components/scene_objects/map/data/land.png';
          //var htMapPng = 'components/scene_objects/map/data/global_dem_unmasked.png';

          var htMapPng = 'http://ec2-52-16-245-62.eu-west-1.compute.amazonaws.com:8080/' +
                    'thredds/wms/testLab/global_dem_unmasked.nc?' +
                    'REQUEST=GetMap&STYLES=boxfill/greyscale&FORMAT=image/png&' +
                    'HEIGHT=1024&WIDTH=1024&BBOX=48.77,-10.12,59.29,2.43&CRS=EPSG:4326&' +
                    'LAYER=topo&VERSION=1.3.0&LAYERS=topo&COLORSCALERANGE=0,1000&NUMCOLORBANDS=253&ABOVEMAXCOLOR=extend';
          // HEIGHT=1506&WIDTH=1261
          THREE.ImageUtils.crossOrigin = '*';
          var dispTexture = THREE.ImageUtils.loadTexture( htMapPng, THREE.UVMapping,
                    function(){}, function(xhr){console.error('Error loading', xhr)} );
          //dispTexture.flipY=false;
          var diffTexture = new THREE.ImageUtils.loadTexture('components/scene_objects/map/data/mapserv.jpeg');

          var uniforms = THREE.UniformsUtils.merge( [

            THREE.UniformsLib[ "fog" ],
            THREE.UniformsLib[ "lights" ],
            THREE.UniformsLib[ "shadowmap" ],

            {

              "enableAO"      : { type: "i", value: 0 },
              "enableDiffuse"   : { type: "i", value: 0 },
              "enableSpecular"  : { type: "i", value: 0 },
              "enableReflection": { type: "i", value: 0 },
              "enableDisplacement": { type: "i", value: 0 },

              "tDisplacement": { type: "t", value: null }, // must go first as this is vertex texture
              "tDiffuse"     : { type: "t", value: null },
              "tCube"      : { type: "t", value: null },
              "tNormal"    : { type: "t", value: null },
              "tSpecular"    : { type: "t", value: null },
              "tAO"      : { type: "t", value: null },

              "uNormalScale": { type: "v2", value: new THREE.Vector2( 1, 1 ) },

              "uDisplacementBias": { type: "f", value: 0.0 },
              "uDisplacementScale": { type: "f", value: 1.0 },

              "uDiffuseColor": { type: "c", value: new THREE.Color( 0xffffff ) },
              "uSpecularColor": { type: "c", value: new THREE.Color( 0x111111 ) },
              "uAmbientColor": { type: "c", value: new THREE.Color( 0xffffff ) },
              "uShininess": { type: "f", value: 30 },
              "uOpacity": { type: "f", value: 1 },

              "useRefract": { type: "i", value: 0 },
              "uRefractionRatio": { type: "f", value: 0.98 },
              "uReflectivity": { type: "f", value: 0.5 },

              "uOffset" : { type: "v2", value: new THREE.Vector2( 0, 0 ) },
              "uRepeat" : { type: "v2", value: new THREE.Vector2( 1, 1 ) },

              "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }

            }

          ] );

          uniforms[ "enableDisplacement" ] = { type: 'i', value: 1 };
          uniforms[ "enableDiffuse" ] = { type: 'i', value: 0 };
          uniforms[ "tDiffuse"].value = diffTexture;
          uniforms[ "tDiffuseOpacity" ] = { type: 'f', value: 1.0 };
          uniforms[ "tDisplacement" ] = { type: 't', value: dispTexture };
          uniforms[ "uDisplacementScale" ] = { type: 'f', value: 100 };

          uniforms[ "tNormal" ] = { type: 't', value: new THREE.ImageUtils.loadTexture( 'components/scene_objects/map/data/flat.png' )};

          uniforms[ "uDiffuseColor"].value = new THREE.Color( diffuse );
          uniforms[ "uSpecularColor"].value = new THREE.Color( specular );
          uniforms[ "uAmbientColor"].value = new THREE.Color( ambient );
          uniforms[ "uShininess"].value = shininess;

          uniforms[ "uPointLightPos"] =   { type: "v3", value: pointLight.position },
              uniforms[ "uPointLightColor" ] = {type: "c", value: new THREE.Color( pointLight.color )};
          uniforms[ "uAmbientLightColor" ] = {type: "c", value: new THREE.Color( ambientLight.color )};

          uniforms[ "uDisplacementPostScale" ] = {type: 'f', value: 5 };

          uniforms[ "bumpScale" ] = { type: "f", value: 10 };


          var material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: scope.vm.shaders.vertex_shader_heightmap,
            fragmentShader: scope.vm.shaders.fragment_shader_heightmap,
            side: THREE.DoubleSide
          } );


          // GEOMETRY
          var geometry = new THREE.PlaneGeometry(scope.datashape.x, scope.datashape.y, 256, 256);
          geometry.computeTangents();

          var mesh = new THREE.Mesh(geometry, material);
          mesh.position.y = -(scope.datashape.z / 2)*scope.zscaling;
          mesh.rotation.x = (3* Math.PI) / 2;
          parentCtrl.addSomething(mesh);
        };

        scope.vm.fetchShaders();
        scope.$on(scope.vm.load_msg, function() {
          scope.vm.setShaders();
          buildLand();
        })
      }
    };
  });

function mapController($scope, glMapShaderRequestService, glSkyboxParameterService) {
  var vm = this;

  vm.shaderService = glMapShaderRequestService;
  vm.paramService = glSkyboxParameterService;

  vm.shaders = null;
  vm.load_msg = 'mapShadersLoaded';

  vm.fetchShaders = function() {
    var shader_root = 'components/scene_objects/map/shaders/';
    vm.shaderService.setShaders(
      {
        fragment_shader_heightmap: shader_root+'fragment_shader_heightmap.c',
        vertex_shader_heightmap: shader_root+'vertex_shader_heightmap.c'
      });
    vm.shaderService.setMessage(vm.load_msg);
    vm.shaderService.loadShaders();
  }

  vm.setShaders = function() {
    vm.shaders = vm.shaderService.shaders;
  }
}
