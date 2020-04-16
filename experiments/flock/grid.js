function Grid(
	min = -50,
	max = 50,
	cubeSize = 10,
) {
	const limit = (max - min) / cubeSize;
	const limit2 = limit ** 2;
	const limit3 = limit ** 3;
	const grid = [];

	function fillGrid(boids) {
		// clear grid
		for (let i = 0; i <= limit ** 3; i++) {
			grid[i] = [];
		}
		// put boids in grid
		boids.forEach(boid => {
			const { x, y, z } = boid.position;
			const i = Math.max(Math.min(Math.round((x - min) / cubeSize) * (limit2)
			 		+ Math.round((y - min) / cubeSize) * limit
			 		+ Math.round((z - min) / cubeSize)
			 		, limit3), 0);
			grid[i].push(boid);
		});
	}

	function getBoids({ x, y, z }, searchDistance = 1) {
		const _x = Math.round((x - min) / cubeSize);
		const _y = Math.round((y - min) / cubeSize);
		const _z = Math.round((z - min) / cubeSize);

		const found = [];

		const xStart = Math.max(_x - searchDistance, 0);
		const yStart = Math.max(_y - searchDistance, 0);
		const zStart = Math.max(_z - searchDistance, 0);

		for(let i = xStart; i <= _x + searchDistance && i <= limit; i++) { 
			for(let j = yStart; j <= _y + searchDistance && j <= limit; j++) {
				for(let k = zStart; k <= _z + searchDistance && k <= limit; k++) {
					const here = grid[(i * (limit2)) + (j * limit) + k];
					if (here) here.forEach(boid => found.push(boid));
				}
			}		
		}

		return found;
	}

	return { getBoids, fillGrid };
}
