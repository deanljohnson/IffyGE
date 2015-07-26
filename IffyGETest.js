(function definitionTest() {
	console.log("IffyGE is defined: " + (IFFYGE ? true : false).toString());
}());

(function vectorTests() {
	var a = new IFFYGE.Vector(1, 0),
		b = new IFFYGE.Vector(2, 0);

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
		var nonZeroA = new IFFYGE.Vector(10, 10),
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
			var a = new IFFYGE.ECS.Components.Transform(),
				b = new IFFYGE.ECS.Components.Transform();

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
			var a = new IFFYGE.ECS.Components.Appearance("Images/Test.png", 10, 10);
			console.log("FINISH APPEARANCE TEST");
		}());

		console.log("Component Tests Completed");
	}());

	(function entityTests() {
		var a = new IFFYGE.ECS.Entity(),
			comp = new IFFYGE.ECS.Components.Transform();

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
			var e = new IFFYGE.ECS.Entity(),
				transform = new IFFYGE.ECS.Components.Transform(),
				appearance = new IFFYGE.ECS.Components.Appearance("Images/Test.png", 0, 0, 10, 10),
				renderer = new IFFYGE.ECS.SubSystems.Renderer(document.getElementById("testCanvas"));

			e.addComponent(transform);
			e.addComponent(appearance);

			renderer.update([e]);

			e.components.Transform.position.x += 50;
			e.components.Transform.origin.y += 5;

			renderer.update([e]);

			console.log("Render Test Completed");
		}());
	}());

	console.log("ECS Tests Completed");
}());