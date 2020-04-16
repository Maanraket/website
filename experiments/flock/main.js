// setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// size of scene
const _radius = 50;

// put camera in a nice position and point it in the right direction
camera.position.set(0, 0, _radius * 0.8);

const controls = new THREE.OrbitControls( camera );

// Add wireframe sphere around scene to know what we're looking at
const sphereGeometery = new THREE.SphereGeometry(_radius * 1.1, 25, 25);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true });
const sphereMesh = new THREE.Mesh(sphereGeometery, sphereMaterial);
// scene.add(sphereMesh);

// spawn boids
const boids = Array(1000).fill(null).map(() => Boid(scene, _radius));
// instantiate grid
const grid = Grid(-_radius * 1.2, _radius * 1.2, 5);

let pause = false;
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	controls.update();

	if (pause) return;

	grid.fillGrid(boids);

	boids.forEach(boid => {
		boid.calculateSpeedFromGrid(grid);
		// boid.calculateSpeed(boids);
		boid.move();
	});
}
animate();

window.addEventListener('keypress', e => {
	if (e.key === 'p') {
		pause = !pause;
	}
});
