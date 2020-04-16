// global state for now
let xLeft, yLeft, xRight, yRight;

const videoWidth = 800;
const videoHeight = Math.round(videoWidth * 9 / 16);

const minConfidence = 0.6;

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById('video');
  video.width = videoWidth;
  video.height = videoHeight;

  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: videoWidth,
      height: videoHeight,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await setupCamera();
  video.play();

  return video;
}

async function track(video, net){
  const imageScaleFactor = 0.2;
  const flipHorizontal = true;
  const outputStride = 16;
  const pose = await net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
  
  pose.keypoints.forEach(keypoint => {
    if(keypoint.score < minConfidence) return;
    if(keypoint.part === 'leftEye'){
      xLeft = keypoint.position.x / videoWidth;
      yLeft = keypoint.position.y / videoHeight;
    } else if(keypoint.part === 'rightEye'){
      xRight = keypoint.position.x / videoWidth;
      yRight = keypoint.position.y / videoHeight;
    }
  });

  requestAnimationFrame(() => track(video, net));
}

async function startTracking(){
  const video = await loadVideo();
  const net = await posenet.load(0.75);

  requestAnimationFrame(() => track(video, net));
}

startTracking();