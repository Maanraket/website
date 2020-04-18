let img, c, i, capture;
let blendmodes;
let webcamMode = false;
let frameSize = 2; //frame gets divided by 'frameSize' to determine size of next frame

function preload(){
  img = loadImage('./img/bg.jpeg');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
  image(img, 0, 0, width);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  blendmodes = [BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN, ADD];
  i = 0;
}

function draw(){
  blendMode(blendmodes[i]);
  if(webcamMode)
    image(capture, 0, 0, width, height);
  c = get();
  drawImage();
}

function drawImage(){
  c.resize(width/frameSize, height/frameSize);
  c.set();
  c.updatePixels();
  image(c, mouseX-width/(frameSize*2), mouseY-height/(frameSize*2));
}

function keyTyped() {
  if (key==='m') {
    i++;
    if(i>blendmodes.size-1) {
      i = 0;
    }
    console.log("BLENDMODE CHANGE! " + blendmodes[i]);
  } else if (key==="r") {
    print('REFRESH!');
    blendMode(blendmodes[0]);
    if(webcamMode) {
      image(capture, 0, 0, width, height);
    } else {
      image(img, 0, 0, width);
    }
  } else if (key === "p") {
    console.log("CHANGE MY PICTURE");
    img = loadImage('https://picsum.photos/' + width + '/' + height, _img => {
      blendMode(blendmodes[0]);
      image(_img, 0, 0, width);
    });
  } else if (key === "c") {
    console.log("WEBCAM MODE ACTIVATE");
    webcamMode = !webcamMode;
    // image(capture, 0, 0, width);
  }
}
