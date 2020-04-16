function Boid(
	_scene,
	_radius = 50,
	initialPosition = randomPosition(),
	numberOfCones = 4,
	neighborRadius = 4,
	repelRadius = 2,
	speedLimit = 0.4,

	cohesionFactor = 0.005,
	alignmentFactor = 0.10,
	separationFactor = 0.1,
	wallFactor = 0.01,
	centerPull = 0.0005,

	enemyProbability = 0.01,
	enemyRadius = 10,
	enemyRepelFactor = 0.1,
	enemyCohesionFactor = 0.05
	) {

	const isEnemy = Math.random() < enemyProbability;

	const cones = [];
	for (let i = 0; i < numberOfCones; i++) {
		const radius = 0.3 / Math.sqrt(i + 1);
		const height = 1 / Math.sqrt(i + 1);
		const geometry = new THREE.ConeGeometry( radius, height, 4 );
		const material = new THREE.MeshBasicMaterial({ color: (isEnemy ? 0xFF0000 : Math.random() * 0x00ff00) });
		const mesh = new THREE.Mesh( geometry, material );
		_scene.add(mesh);
		cones.push(mesh);
	}

	const head = cones[0];

	const position = Object.assign(head.position, initialPosition);

	const speed = new THREE.Vector3( 
		Math.random() * speedLimit * 2 - speedLimit, 
		Math.random() * speedLimit * 2 - speedLimit, 
		Math.random() * speedLimit * 2 - speedLimit
	);

	function calculateSpeed(boids) {
		const neighbors = [];
		const repellors = [];
		const enemies = [];
		boids.forEach(boid => {
			if (boid.position === position) {
				return;
			}
			const distance = position.distanceTo(boid.position);
			// find enemies
			if (!isEnemy && boid.isEnemy) {
				if (distance < enemyRadius) enemies.push(boid);
				return;
			}
			// find neighbors and repellors
			if (distance < neighborRadius) {
				if (distance < repelRadius) {
					repellors.push(boid);
				} else {
					if (!boid.isEnemy) neighbors.push(boid);
				}
			}
		});

		// cohesion
		if (neighbors.length) {
			const neighborsDiff = neighbors.reduce(
				(acc, neighbor) => acc.add(neighbor.position),
				new THREE.Vector3(0, 0, 0)
			).divideScalar(neighbors.length).sub(position);
			speed.add(neighborsDiff.multiplyScalar(isEnemy ? enemyCohesionFactor : cohesionFactor));
		}

		// alignment
		if (neighbors.length) {
			const neighborsDiff = neighbors.reduce(
				(acc, neighbor) => acc.add(neighbor.speed),
				new THREE.Vector3(0, 0, 0)
			).divideScalar(neighbors.length).sub(speed);
			speed.add(neighborsDiff.multiplyScalar(alignmentFactor));
		}

		// separation
		if (repellors.length) {
			const repellorsDiff = repellors.reduce(
				(acc, repellor) => acc.add(repellor.position),
				new THREE.Vector3(0, 0, 0)
			).divideScalar(repellors.length).sub(position);
			speed.sub(repellorsDiff.multiplyScalar(separationFactor * (repelRadius / repellorsDiff.length()) ));
		}

		// flee from enemies
		if (enemies.length) {
			const enemiesDiff = enemies.reduce(
				(acc, enemy) => acc.add(enemy.position),
				new THREE.Vector3(0, 0, 0)
			).divideScalar(enemies.length).sub(position);
			speed.sub(enemiesDiff.multiplyScalar(enemyRepelFactor * (enemyRadius / enemiesDiff.length()) ));
		}

		// pull towards the center 
		speed.add(position.clone().negate().multiplyScalar(centerPull));
		
		speed.clamp(
			new THREE.Vector3(-speedLimit, -speedLimit, -speedLimit),
			new THREE.Vector3(speedLimit, speedLimit, speedLimit),
		);
	}

	function calculateSpeedFromGrid(grid) {
		const closeBoids = grid.getBoids(position, 2);

		calculateSpeed(closeBoids);
	}

	function move() {
		// walls
		const distanceFromCenter = position.length();
		speed.add(position.clone().multiplyScalar(Math.min(0, (_radius - distanceFromCenter) * wallFactor)));

		moveTail();
		position.add(speed);
		rotate();
	}

	function moveTail() {
		for (let i = numberOfCones - 1; i > 0; i--) {
			cones[i].position.copy(cones[i - 1].position);
			cones[i].rotation.copy(cones[i - 1].rotation);
		}
	}

	function rotate() {
		const normalizedSpeed = speed.clone().normalize();
		const coneRotation = new THREE.Vector3(0, 1, 0);

		head.quaternion.setFromUnitVectors(coneRotation, normalizedSpeed)
	}

	return { position, speed, move, rotate, calculateSpeed, calculateSpeedFromGrid, isEnemy };
}