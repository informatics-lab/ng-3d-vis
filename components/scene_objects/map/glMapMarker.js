// @msaunby wrote this.  It's probably got bugs in it.

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


function mapMarkerController($scope, glVideoService, glConstantsService, glCoordService) {
  var vm = this;
  vm.coordService = glCoordService;
  vm.addMarker = function(attrs)
  {
    var loc = {};
    loc.lat = Number(attrs.coordinate.split(',')[0]);
    loc.lon = Number(attrs.coordinate.split(',')[1]);
    var newCoords = vm.coordService.lookupCoords(loc);
    var spritey = vm.makeTextSprite(attrs['label'], newCoords);
    return spritey;
  };

  vm.makeTextSprite = function( myString, myCoords )
  {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var fsize = 80;
    var myFont = fsize + "px Open Sans,sans-serif";
    ctx.font = myFont;
    var metrics = ctx.measureText(myString);
    canvas.width = metrics.width * 2 + 10;
    canvas.height = fsize * 4;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(canvas.width/2, 0, canvas.width, canvas.height/4);
    ctx.fillStyle = "rgba(255,255,255,1.0)";
    ctx.fillRect(canvas.width/2-2, 0, 4, canvas.height/2);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.font = myFont;
    ctx.fillText(myString, canvas.width/2 + 2, fsize * 0.75);


    var spriteMap = THREE.ImageUtils.loadTexture( canvas.toDataURL() );

    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, fog: true } );

    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set( canvas.width * 0.1, canvas.height * 0.1, 0 );

    sprite.position.set( myCoords.x, myCoords.y, myCoords.z );
    return sprite;

  };


}
