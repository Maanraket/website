function unitDistancesToCenter(){
	const inMm = distancesToCenterInMm();
	return {x: inMm.x / screenWidthMm, y: inMm.y / screenWidthMm * aspectRatio};
}

function unitDistanceToCamera(){
	return distanceToCameraInMm() / screenWidthMm;
}

function distancesToCenterInMm(){
	const totalLength = Math.tan(0.5 * cameraFovRadians) * distanceToCameraInMm();
	const eyesX = (xLeft + xRight) / 2 - 0.5;
	const eyesY = (yLeft + yRight) / 2 - 0.5;
	return {x : eyesX * totalLength * 2, y: eyesY * totalLength * 2};
}

function distanceToCameraInMm(){
	const unitDistance = 0.5 / Math.tan(0.5 * cameraFovRadians);
	const eyesDistance = distance(xLeft, yLeft, xRight, yRight);
	const angle = Math.atan(eyesDistance / unitDistance);
	return eyesDistanceMm / Math.tan(angle);
}

function distance(x1, y1, x2, y2){
	const aSquared = (x1 - x2) * (x1 - x2);
	const bSquared = (y1 - y2) * (y1 - y2);
	return Math.sqrt(aSquared + bSquared);
}
