(function definitionTest() {
	console.log("JSGE is defined: " + (JSGE ? true : false).toString());
}());

var game = new JSGE.Game(function () {}, function () {}, 60, document.getElementById("testCanvas"));

(function vectorTests() {
	var a = new JSGE.Vector(1, 0),
		b = new JSGE.Vector(2, 0);

	(function creationTest(){
		var result = (a.x === 1 && a.y === 0 && b.x === 2 && b.y === 0);
		if (!result) {
			console.log("Vector creation failed.");
		}
	}());

	(function lengthTest() {
		var result = (a.length() === 1 && b.length() === 2);
		if (!result) {
			console.log("Vector.length test failed.");
		}
	}());

	(function angleTest() {
		var result = (a.angle() === 0 && b.angle() === 0);
		if (!result) {
			console.log("Vector.angle test failed.");
		}
	}());

	(function addTest() {
		var c = a.add(b),
			result = (c.x === 3 && c.y === 0);
		if (!result) {
			console.log("Vector.add test failed.");
		}
	}());

	(function subtractTest() {
		var c = a.subtract(b),
			result = (c.x === -1 && c.y === 0);
		if (!result) {
			console.log("Vector.subtract test failed.");
		}
	}());

	(function multiplyTest() {
		var c = a.multiply(2),
			result = (c.x === 2 && c.y === 0);
		if (!result) {
			console.log("Vector.multiply test failed.");
		}
	}());

	(function divideTest() {
		var nonZeroA = new JSGE.Vector(10, 10),
			c = nonZeroA.divide(2),
			result = (c.x === 5 && c.y === 5);
		if (!result) {
			console.log("Vector.divide test failed.");
		}
	}());

	(function scaleTest() {
		var c = a.scale(2),
			result = (c.x === 2 && c.y === 0);
		if (!result) {
			console.log("Vector.scale test failed.");
		}
	}());

	(function setAngleTest() {
		var c = a.setAngle(Math.PI),
			result = (c.angle() === Math.PI);
		if (!result) {
			console.log("Vector.setAngle test failed.");
		}
	}());

	(function memberwiseAdjustmentTest() {
		a.x += 5;

		a = a.add(new JSGE.Vector(-5, 0));

		var result = (a.x === 1);

		if (!result) {
			console.log("Vector memberwise adjustment failed.");
		}
	}());

	(function immutabilityTest() {
		var result = (a.x === 1 && a.y === 0 && b.x === 2 && b.y === 0);
		if (!result) {
			console.log("Vector immutability test failed.");
		}
	}());

	console.log("Vector Tests Completed");
}());

(function ECSTests() {
	(function componentTests() {
		(function transformTests() {
			var a = new JSGE.ECS.COMPONENTS.Transform(),
				b = new JSGE.ECS.COMPONENTS.Transform();

			(function creationTests() {
				var result = (a.position.x === 0 && a.position.y === 0 && a.origin.x === 0 && a.origin.y === 0 && a.rotation === 0);
				if (!result) {
					console.log("Components.Transform creation tests failed");
				}
			}());

			(function moveTest() {
				var ax = a.position.x,
					ay = b.position.y,
					dx = 5,
					dy = 5;

				a.position = a.position.addValues(dx, dy);

				var result = (a.position.x === (ax + dx) && a.position.y === (ay + dy));

				if (!result) {
					console.log("Components.Transform.move tests failed");
				}

				a.position = a.position.addValues(-dx, -dy);
			}());

			(function rotateTest() {
				var ar = a.rotation,
					dr = .5;

				a.rotation += dr;

				var result = (a.rotation === ar + dr);

				if (!result) {
					console.log("Components.Transform.rotate tests failed");
				}
			}());
		}());

		(function appearanceTests() {
			var a = new JSGE.ECS.COMPONENTS.Appearance("Images/Test.png", 0, 0, 10, 10),
				result = (a.image.width === 10 && a.image.height === 10 && a.image.srcX === 0 && a.image.srcY === 0);

			if (!result) {
				console.log("Components.Appearance tests failed");
			}
		}());

		(function tagTests() {
			var tagComp = new JSGE.ECS.COMPONENTS.Tag("a", "b"),
				result = true;

			result = (tagComp.containsTag("a") && tagComp.containsTag("b")) ? result : false;
			result = (tagComp.removeTag("a") && !tagComp.containsTag("a")) ? result : false;
			result = (tagComp.addTag("a") && tagComp.containsTag("a")) ? result : false;

			if (!result) {
				console.log("COMPONENTS.Tag tests failed");
			}
		}());

		console.log("Component Tests Completed");
	}());

	(function entityTests() {
		var a = new JSGE.ECS.Entity(),
			comp = new JSGE.ECS.COMPONENTS.Transform();

		(function addComponentTest() {
			a.addComponent(comp);

			var result = a.components[comp.name] ? true : false;

			delete a.components[comp.name];

			if (!result) {
				console.log("Entity.addComponent test failed");
			}
		}());

		(function() {
			a.addComponent(comp);
			a.removeComponent(comp.name);

			var result = a.components[comp.name] ? false : true;

			if (!result) {
				console.log("Entity.removeComponent test failed");
			}
		}());

		console.log("Entity Tests Completed");
	}());

	(function systemTests() {
		(function rendererTest() {
			var e = new JSGE.ECS.Entity(),
				transform = new JSGE.ECS.COMPONENTS.Transform(),
				appearance = new JSGE.ECS.COMPONENTS.Appearance("Images/Test.png", 0, 0, 10, 10),
				renderer = new JSGE.ECS.SYSTEMS.Renderer(document.getElementById("testCanvas"));

			e.addComponent(transform);
			e.addComponent(appearance);

			var update = function () {
				e.components.Transform.position.x += 5;
				if (e.components.Transform.position.x >= 200) {
					e.components.Transform.position.x = 50;
				}
			};

			var render = function () {
				renderer.update([e]);
			};

			game.setUpdateFunction(update);
			game.setRenderFunction(render);
			game.start();

			console.log("Render Test Completed");
		}());

		(function physicsTest() {
			var e = new JSGE.ECS.Entity(),
				transform = new JSGE.ECS.COMPONENTS.Transform(),
				physicsComp = new JSGE.ECS.COMPONENTS.Physics(),
				physicsSys = new JSGE.ECS.SYSTEMS.Physics(10);

			e.addComponent(transform);
			e.addComponent(physicsComp);

			var startingY = e.components.Transform.position.y;

			physicsSys.update([e]);

			var result = (startingY < e.components.Transform.position.y);

			if (!result) {
				console.log("Physics Gravity Test Failed");
			}
		}());
	}());

	console.log("ECS Tests Completed");
}());