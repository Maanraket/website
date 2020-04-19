let img, c, i, frameSize, resizeWidth, resizeHeight, maskPosWidth, maskPosHeight, capture;
let blendmodes;
let webcamMode = false;

/*
TODO:
create modal window with commands that can be Closed
create ASCII filter for the canvas
*/

function preload(){
  img = loadImage('./img/bg.jpeg');
}

function setup() {
  imageMode(CENTER);
	createCanvas(windowWidth, windowHeight);
  //frame gets divided by 'frameSize' to determine size of next frame
  frameSize = 1.3;
  //precalculate values to same computation time based on frameSize
  redrawFrameSizeParams(frameSize);

  image(img, width/2, height/2, width);
  noStroke();
  fill(255);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  blendmodes = [BLEND, DARKEST, LIGHTEST, DIFFERENCE, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD];
  i = 0;
}

function draw(){
  blendMode(blendmodes[i]);
  if(webcamMode) {
    drawMask();
    image(capture, width/2, height/2, width, height);
  }
  c = get();
  drawImage();
}

function redrawFrameSizeParams(_frameSize = frameSize){
  resizeWidth = width / frameSize;
  resizeHeight = height / frameSize;
  maskPosWidth = width/(frameSize*2);
  maskPosHeight = height/(frameSize*2);
}

function drawMask(){
  // create mask
  const maskImage = createGraphics(width,height);
  maskImage.rect(0,0,width, height);
  maskImage.erase();
  maskImage.rect(mouseX-maskPosWidth,mouseY-maskPosHeight,resizeWidth,resizeHeight);
  maskImage.noErase();
  capture.mask(maskImage);
}

function drawImage(){
  c.resize(resizeWidth, resizeHeight);
  c.set();
  c.updatePixels();
  image(c, mouseX, mouseY);
}

function mouseWheel(event) {
  frameSize += event.delta/100;
  if(frameSize < 1) {
    frameSize = 1;
  }
  redrawFrameSizeParams();
  //uncomment to block page scrolling
  return false;
}

function keyTyped() {
  if (key==='m') {
    i++;
    if(i>blendmodes.length-1) {
      i = 0;
    }
    console.log("BLENDMODE CHANGE! " + blendmodes[i]);
  } else if (key==="r") {
    print('REFRESH!');
    blendMode(blendmodes[0]);
    if(webcamMode) {
      image(capture, width/2, height/2, width, height);
    } else {
      image(img, width/2, height/2, width);
    }
  } else if (key === "p") {
    console.log("CHANGE MY PICTURE!");
    img = loadImage('https://picsum.photos/' + width + '/' + height, _img => {
      blendMode(blendmodes[0]);
      image(_img, width/2, height/2, width);
    });
  } else if (key === "c") {
    console.log("TOGGLE WEBCAM MODE!");
    webcamMode = !webcamMode;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redrawFrameSizeParams();
}
