angular.module('three')
.directive('glMapMarker', function () {
  return {
    restrict: 'E',
    require: "^glScene",
    scope: {
      'name': '@'
    },
    controller: mapMarkerController,
    controllerAs: 'vm',
    link: function postLink(scope, element, attrs, parentCtrl) {

      scope.$on('video data loaded', function () {
        parentCtrl.sceneService.addSomething(scope.name, scope.vm.addMarker(attrs));
      });

    }
  };
});


// Sprite example
// http://threejs.org/examples/webgl_sprites.html

function mapMarkerController($scope, glVideoService, glConstantsService) {
  var vm = this;
  vm.addMarker = function(attrs)
  {
    console.log("adding map marker", attrs);
    var spritey = vm.makeTextSprite(attrs['label']);
    console.log("have sprite", spritey);
    return spritey;
  };

  vm.makeTextSprite = function( myString )
  {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var fsize = 80;
    var myFont = fsize + "px Open Sans,sans-serif";
    ctx.font = myFont;
    var metrics = ctx.measureText(myString);
    console.log(metrics);
    canvas.width = metrics.width + 5;
    canvas.height = fsize;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.font = myFont;
    ctx.fillText(myString, 2, canvas.height * 0.75);


    var spriteMap = THREE.ImageUtils.loadTexture( canvas.toDataURL() );

    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, fog: true } );

    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set( 20, 10, 10 );

    sprite.position.set( 0, -40, 0 );
    //sprite.position.normalize();
    //sprite.position.multiplyScalar( radius );

    return sprite;

  };


}
