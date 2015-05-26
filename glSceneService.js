'use strict';

angular.module('ngWebglDemo')
	.service('glSceneService', function() {
		this.scene = null;

		function setScene(scene) {
			this.scene = scene;
		}
		this.setScene = setScene;

		function addSomething(thing) {
			this.scene.add(thing);
		}
		this.addSomething = addSomething;
	});