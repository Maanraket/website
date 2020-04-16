function Tadpole(numberOfSpheres = 5, size = 1, positionsGap = 5){
	this.positionsGap = positionsGap;
	this.spheres = [];
	this.positions = [];
	this.numberOfSpheres = numberOfSpheres;

	for (let i = 0; i < numberOfSpheres; i++) {
		const geometry = new THREE.SphereGeometry((numberOfSpheres - i) / numberOfSpheres * size, 16, 16);
		const material = new THREE.MeshLambertMaterial({ color: Math.floor(Math.random()*0xffff00) });
		const sphere = new THREE.Mesh(geometry, material);

		this.spheres.push(sphere);
	}
}

Tadpole.prototype.setPosition = function(position) {
	if (this.positions.length < this.numberOfSpheres * this.positionsGap) {
		this.positions.push(position);
	} else {
		this.positions = [position, ...this.positions.slice(0, this.positions.length - 2)];
	}

	for (let i = 0; i < this.positions.length; i += this.positionsGap) {
		Object.assign(this.spheres[Math.floor(i / this.positionsGap)].position, this.positions[i]);
	}
}

Tadpole.prototype.addToScene = function(scene) {
	this.spheres.forEach(sphere => scene.add(sphere));
}

Tadpole.prototype.removeFromScene = function(scene) {
	this.spheres.forEach(sphere => scene.remove(sphere));
}

Tadpole.prototype.getHeadPosition = function() {
	return this.spheres[0].position.clone();
}