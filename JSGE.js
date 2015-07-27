var JSGE = (function (JSGE) {
	"use strict";

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

	JSGE.Input = (function(Vector) {
		function CanvasClick(action, pos) {
			var that = {};

			that.action = action;
			that.position = pos;

			return that;
		}

		function Input(canvas) {
			var that = {},
				canvasClicks = [],
				inputMap = {},
				cursorPos = new Vector(0, 0);

			inputMap["LeftMouse"] = "LeftMouse";
			inputMap["MiddleMouse"] = "MiddleMouse";
			inputMap["RightMouse"] = "RightMouse";

			function getCursorPosition(canvas, event) {
				var rect = canvas.getBoundingClientRect();
				return new Vector(event.clientX - rect.left, event.clientY - rect.top);
			}

			canvas.onmouseup = function(e) {
				var cursorPos = getCursorPosition(canvas, e);

				if (e.button === 0) {
					canvasClicks.push(new CanvasClick(inputMap["LeftMouse"], cursorPos));
					e.preventDefault();
					return false;
				} else if (e.button === 1) {
					canvasClicks.push(new CanvasClick(inputMap["MiddleMouse"], cursorPos));
					e.preventDefault();
					return false;
				}
			};

			canvas.oncontextmenu = function(e) {
				var cursorPos = getCursorPosition(canvas, e);

				canvasClicks.push(new CanvasClick(inputMap["RightMouse"], cursorPos));

				e.preventDefault();
				return false;
			};

			canvas.addEventListener('mousemove', function(evt) {
				cursorPos = getCursorPosition(canvas, evt);
			}, false);

			function update() {
				canvasClicks = [];
			}

			function getInput(inputString) {
				var cc, c, cl;

				if (inputString === "MousePosition") {
					return cursorPos;
				}

				for (c = 0, cl = canvasClicks.length; c < cl; c++) {
					cc = canvasClicks[c];
					if (cc.action === inputString) {
						return cc;
					}
				}

				return false;
			}

			that.update = update;
			that.getInput = getInput;
			that.inputMap = inputMap;

			return that;
		}

		return Input;
	}(JSGE.Vector));

	JSGE.Game = (function() {
		function Game(updateFunction, renderFunction, updatesPerSecond, canvas) {
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
			that.input = new JSGE.Input(canvas);

			return that;
		}

		return Game;
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

	JSGE.ECS.COMPONENTS = {};

	JSGE.ECS.COMPONENTS.Transform = (function(Component, Vector) {
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

	JSGE.ECS.COMPONENTS.Appearance = (function(Component) {
		function Appearance(imgSrc, x, y, width, height) {
			var that = new Component("Appearance"),
				image = new Image();

			image.src = imgSrc;
			image.width = width;
			image.height = height;
			image.srcX = x;
			image.srcY = y;

			that.image = image;

			return that;
		}

		return Appearance;
	}(JSGE.ECS.Component));

	JSGE.ECS.COMPONENTS.Physics = (function(Component, Vector) {
		function Physics() {
			var that = new Component("Physics");

			that.velocity = new Vector(0, 0);
			that.mass = 1;

			return that;
		}

		return Physics;
	}(JSGE.ECS.Component, JSGE.Vector));

	JSGE.ECS.COMPONENTS.Tag = (function(Component) {
		function Tag() {
			var that = new Component("Tag"),
				tags = [];

			for (var a = 0, al = arguments.length; a < al; a++) {
				tags.push(arguments[a]);
			}

			function containsTag(tag) {
				var currentTag, t, tl;

				for (t = 0, tl = tags.length; t < tl; t++) {
					currentTag = tags[t];
					if (currentTag === tag) {
						return true;
					}
				}

				return false;
			}

			function addTag(tag) {
				var currentTag, t, tl, duplicate = false;

				for (t = 0, tl = tags.length; t < tl; t++) {
					currentTag = tags[t];
					if (currentTag === tag) {
						duplicate = true;
					}
				}

				if (!duplicate) {
					tags.push(tag);
					return true;
				}

				return false;
			}

			function removeTag(tag) {
				var currentTag, t, tl;

				for (t = 0, tl = tags.length; t < tl; t++) {
					currentTag = tags[t];
					if (currentTag === tag) {
						tags.splice(t, 1);
						return true;
					}
				}

				return false;
			}

			that.containsTag = containsTag;
			that.addTag = addTag;
			that.removeTag = removeTag;

			return that;
		}

		return Tag;
	}(JSGE.ECS.Component));

	JSGE.ECS.COMPONENTS.MouseTracker = (function(Component) {
		function MouseTracker() {
			var that = new Component("MouseTracker");

			that.dirToMouse = 0;
			that.distToMouse = 0;

			return that;
		}

		return MouseTracker;
	}(JSGE.ECS.Component));

	JSGE.ECS.SYSTEMS = {};

	JSGE.ECS.SYSTEMS.Renderer = (function() {
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

					if (entity.hasOwnProperty("components")) {
						if (entity.components.hasOwnProperty("Appearance") && entity.components.hasOwnProperty("Transform")) {
							var appearance = entity.components["Appearance"],
								transform = entity.components["Transform"];

							draw(appearance, transform);
						}
					}
				}
			}

			that.update = update;

			return that;
		}

		return Renderer;
	}());

	JSGE.ECS.SYSTEMS.Physics = (function() {
		function Physics(gravValue) {
			var that = {},
				gravity = gravValue;
			//lastTime = performance.now();

			function timeSinceLastUpdate() {
				return .1;
			}

			function update(entities) {
				var entity, e, el, dt = timeSinceLastUpdate();

				for (e = 0, el = entities.length; e < el; e++) {
					entity = entities[e];

					if (entity.hasOwnProperty("components")) {
						if (entity.components.hasOwnProperty("Physics") && entity.components.hasOwnProperty("Transform")) {
							var physicsComp = entity.components["Physics"],
								transformComp = entity.components["Transform"],
								gravAccel = (.5 * gravity * (dt * dt));

							physicsComp.velocity.y += gravAccel;
							transformComp.rotation = physicsComp.velocity.angle();
							transformComp.position = transformComp.position.add((physicsComp.velocity.multiply(dt)));
						}
					}
				}
			}

			that.update = update;

			return that;
		}

		return Physics;
	}());

	return JSGE;
}(JSGE || {}));