function randomPosition() {
	return new THREE.Vector3(
		Math.random() * _radius - _radius * 0.5, 
		Math.random() * _radius - _radius * 0.5, 
		Math.random() * _radius - _radius * 0.5, 
	);
}