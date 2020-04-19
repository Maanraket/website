let img, c, i, frameSize, resizeWidth, resizeHeight, maskPosWidth, maskPosHeight, capture;
let blendmodes;
let webcamMode = false;

/*
TODO:
create modal window with commands that can be Closed
create ASCII filter for the canvas
Make bg image fit the screen properly on mobile
*/

function preload(){
  img = loadImage('./img/bg.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  image(img, width/2, height/2, width, height);
  noStroke();
  fill(255);
  blendmodes = [BLEND, DARKEST, LIGHTEST, DIFFERENCE, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD];
  i = 0;
  iterateBlendMode();

  //frame gets divided by 'frameSize' to determine size of next frame
  frameSize = 1.3;
  redrawFrameSizeParams(frameSize);
}

function draw(){
  if(webcamMode) {
    drawMask();
    image(capture, width/2, height/2, width, height);
  }
  c = get();
  drawImage();
}

function redrawFrameSizeParams(_frameSize = frameSize){
  //Precalculates values to same computation time based on frameSize
  //resizeWidth and resizeHeight are the size of the drawn frame
  resizeWidth = width / frameSize;
  resizeHeight = height / frameSize;
  //maskPosWidth and maskPosHeight are used to calculate the position of the mask
  maskPosWidth = width/(frameSize*2);
  maskPosHeight = height/(frameSize*2);
}

function drawMask(){
  // create mask
  const maskImage = createGraphics(width,height);
  maskImage.rect(0,0,width, height);
  maskImage.erase();
  maskImage.rect(mouseX-maskPosWidth,mouseY-maskPosHeight,resizeWidth,resizeHeight);
  capture.mask(maskImage);
}

function drawImage(){
  c.resize(resizeWidth, resizeHeight);
  c.set();
  c.updatePixels();
  image(c, mouseX, mouseY);
}

function mouseWheel(event) {
  frameSize += event.delta/300;
  if(frameSize < 1) {
    frameSize = 1;
  }
  redrawFrameSizeParams();
  //uncomment to block page scrolling
  return false;
}

function setRandomBackground(){
  img = loadImage('https://picsum.photos/' + width + '/' + height, _img => {
    blendMode(blendmodes[0]);
    image(_img, width/2, height/2, width);
  });
}

function refreshBackground(){
  blendMode(blendmodes[0]);
  if(webcamMode) {
    image(capture, width/2, height/2, width, height);
  } else {
    image(img, width/2, height/2, width);
  }
}

function toggleWebcamMode(){
  if(!webcamMode){
    capture = createCapture(VIDEO);
    capture.size(width, height);
  } else {
    capture.remove();
  }
  webcamMode = !webcamMode;
}

function iterateBlendMode(){
  if(i>blendmodes.length-1) {
    i = 0;
  }
  blendMode(blendmodes[i]);
  i++;
}

function keyTyped() {
  if (key==='m') {
    print("BLENDMODE CHANGE! " + blendmodes[i]);
    iterateBlendMode();
  } else if (key==="r") {
    print('REFRESH!');
    refreshBackground();
  } else if (key === "p") {
    print("CHANGE MY PICTURE!");
    setRandomBackground();
  } else if (key === "c") {
    print("TOGGLE WEBCAM MODE!");
    toggleWebcamMode();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redrawFrameSizeParams();
  if(!webcamMode)
    setRandomBackground();
}
