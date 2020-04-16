const screenWidthMm = 286;
const eyesDistanceMm = 64;
const cameraFovRadians = 1.117; // estimate based on some measurement
const aspectRatio = 9/16;

let renderer;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.7, 1000 );
const tadpole = new Tadpole(7);

// initial
const tadPolePosition = new THREE.Vector3(0, -5, -10);

const direction = new THREE.Vector3(0, 0, 0.2);

function createGround() {
	const geometry = new THREE.PlaneBufferGeometry(200, 200, 200, 200);
	const material = new THREE.MeshBasicMaterial( {
	    color: 0xffffff,
	    wireframe: true,
	} );
	const plane = new THREE.Mesh(geometry, material);
	plane.position.set(0, -10, -10);
	plane.rotation.set(-0.5*Math.PI, 0, 0);
	scene.add( plane );
}

function initScene() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set(0,6,6);
	scene.add( directionalLight );

	tadpole.addToScene(scene);
	tadpole.setPosition(tadPolePosition);
	createGround();
}

let facePositions = Array(10).fill({x: 0, y: 0, z: 1});
function animate(){
	let distanceToCamera = unitDistanceToCamera();
	let distancesToCenter = unitDistancesToCenter();

	facePositions.splice(-1);
	facePositions = [{
					x: distancesToCenter.x, 
					y: distancesToCenter.y, 
					z: distanceToCamera
				}, 
				...facePositions];

	const facePosition = facePositions.reduce
	((average, current) => average + current.x / facePositions.length, 0);

	if (!isNaN(facePosition)) {
		const currentPosition = tadpole.getHeadPosition();
		direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.03 * facePosition);
		tadpole.setPosition(currentPosition.add(direction));
		Object.assign(camera.position, tadpole.getHeadPosition().add(direction.clone().normalize().negate().multiplyScalar(10.0)).add(new THREE.Vector3(0, 5, 0)));
	}
	camera.lookAt(tadpole.getHeadPosition());

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

initScene();
animate();

// MULTIPLAYER

let enemies = [];
var socket = io('https://head-controller.herokuapp.com');
socket.on('connect', function() {
    const sendPosition = () => {
    	if (scene) {
	        socket.emit('position', tadpole.getHeadPosition(), ({ items }) => {
	        	// loop through data.items
	        	// for each item, set the position of a tadpole
	        	items.forEach(item => {
	        		const enemy = enemies.find(({ key }) => key === item.key);
	        		if (enemy) {
	        			enemy.tadPole.setPosition(item.position);
	        		} else {
	        			// new player has entered the field
	        			const taddie = new Tadpole(5, .8, 1);
	        			taddie.addToScene(scene);
	        			taddie.setPosition(item.position)
	        			enemies.push({
	        				key: item.key,
	        				tadPole: taddie,
	        			});
	        		}
	        	});
	        	// remove enemies that weren't in the response
	        	enemies
	        		.filter(enemy => !items.some(({ key }) => key === enemy.key))
	        		.forEach(enemy => {
	        			enemy.tadPole.removeFromScene(scene);
	        		});
	        });
    	}
        setTimeout(sendPosition, 33);
    }
    sendPosition();
});
