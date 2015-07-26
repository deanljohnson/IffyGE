var JSGE = (function (JSGE) {
	"use strict";

	JSGE.Game = (function() {
		function Game(updateFunction, renderFunction, updatesPerSecond) {
			var that = {},
				updateRate = updatesPerSecond ? (1000 / updatesPerSecond) : (1000 / 60),
				updateFunc = updateFunction || function(){},
				renderFunc = renderFunction || function(){};

			function update() {
				updateFunc();
				setTimeout(update, updateRate);
			}

			function render() {
				renderFunc();
				requestAnimationFrame(render);
			}

			function start() {
				update();
				render();
			}

			function setUpdateRate(updatesPerSecond) {
				updateRate = updatesPerSecond;
			}

			function setUpdateFunction(updateFunction) {
				updateFunc = updateFunction;
			}

			function setRenderFunction(renderFunction) {
				renderFunc = renderFunction;
			}

			that.start = start;
			that.setUpdateRate = setUpdateRate;
			that.setUpdateFunction = setUpdateFunction;
			that.setRenderFunction = setRenderFunction;

			return that;
		}

		return Game;
	}());

	JSGE.Vector = (function() {
		function Vector(x, y) {
			var that = {};

			function length() {
				return Math.sqrt((this.x * this.x) + (this.y * this.y));
			}

			function angle() {
				return Math.atan2(this.y, this.x)
			}

			function add(v) {
				return new Vector(this.x + v.x, this.y + v.y);
			}

			function addValues(a, b) {
				return new Vector(this.x + a, this.y + b);
			}

			function subtract(v) {
				return new Vector(this.x - v.x, this.y - v.y);
			}

			function multiply(m) {
				return new Vector(this.x * m, this.y * m);
			}

			function divide(d) {
				return new Vector(this.x / d, this.y / d);
			}

			function scale(l) {
				var length = this.length(),
					scaleFactor = length === 0 ? 0 : l / length;

				return new Vector(this.x * scaleFactor, this.y * scaleFactor);
			}

			function setAngle(angle) {
				var len = this.length();

				return new Vector(Math.cos(angle) * len, Math.sin(angle) * len);
			}

			that.length = length;
			that.angle = angle;
			that.add = add;
			that.addValues = addValues;
			that.subtract = subtract;
			that.multiply = multiply;
			that.divide = divide;
			that.scale = scale;
			that.setAngle = setAngle;
			that.x = x;
			that.y = y;

			return that;
		}

		return Vector;
	}());

	JSGE.ECS = {};

	JSGE.ECS.Entity = (function() {
		var entityCount = 0;

		function Entity() {
			var that = {},
				components = {};

			function addComponent(component) {
				components[component.name] = component;
				return this;
			}

			function removeComponent(componentName) {
				delete this.components[componentName];
				return this;
			}

			function print() {
				console.log(JSON.stringify(this, null, 4));
			}

			that.addComponent = addComponent;
			that.removeComponent = removeComponent;
			that.print = print;
			that.components = components;
			that.id = entityCount++;

			return that;
		}

		return Entity;
	}());

	JSGE.ECS.Component = (function() {
		function Component(name) {
			var that = {};

			that.name = name;

			return that;
		}

		return Component;
	}());

	JSGE.ECS.Components = {};

	JSGE.ECS.Components.Transform = (function(Component, Vector) {
		function Transform() {
			var that = new Component("Transform"),
				position = new Vector(0, 0),
				origin = new Vector(0, 0),
				scale = new Vector(1, 1);

			that.origin = origin;
			that.position = position;
			that.scale = scale;
			that.rotation = 0;

			return that;
		}

		return Transform;
	}(JSGE.ECS.Component, JSGE.Vector));

	JSGE.ECS.Components.Appearance = (function(Component) {
		function Appearance(imgSrc, x, y, width, height) {
			var that = new Component("Appearance"),
				image = new Image();

			image.src = imgSrc;
			image.width = width;
			image.height = height;
			image.srcX = x;
			image.srcY = y;

			that.image = image;

			//drawImage(image, image.x, image.y, image.width, image.height, -origin.x, -origin.y, (image.width * scale.x), (image.height * scale.y));

			return that;
		}

		return Appearance;
	}(JSGE.ECS.Component));

	JSGE.ECS.SubSystems = {};

	JSGE.ECS.SubSystems.Renderer = (function() {
		function Renderer(canvas) {
			var that = {},
				context = canvas.getContext("2d")

			function draw(a, t) {
				context.save();
				context.translate(t.position.x, t.position.y);
				context.rotate(t.rotation);
				context.drawImage(a.image, a.image.srcX, a.image.srcY, a.image.width, a.image.height, -t.origin.x, -t.origin.y, (a.image.width * t.scale.x), (a.image.height * t.scale.y));
				context.restore();
			}

			function update(entities) {
				//Clear previous frame's data
				context.clearRect(0, 0, canvas.width, canvas.height);

				var entity;
				for (var e = 0, el = entities.length; e < el; e++) {
					entity = entities[e];
					if (entity.components.hasOwnProperty("Appearance") && entity.components.hasOwnProperty("Transform")) {
						var appearance = entity.components["Appearance"],
							transform = entity.components["Transform"];

						draw(appearance, transform);
					}
				}
			}

			that.update = update;

			return that;
		}

		return Renderer;
	}());

	return JSGE;
}(JSGE || {}));