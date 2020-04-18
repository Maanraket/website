let img, c, i, capture;
let blendmodes;
let webcamMode = false;
let frameSize = 2; //frame gets divided by 'frameSize' to determine size of next frame

function preload(){
  img = loadImage('./img/bg.jpeg');
}

function setup() {
  imageMode(CENTER);
	createCanvas(windowWidth, windowHeight);
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

function drawMask(){
  // create mask
  const maskImage = createGraphics(width,height);
  maskImage.rect(0,0,width, height);
  maskImage.erase();
  maskImage.rect(mouseX-(width/4),mouseY-(height/4),width/frameSize, height/frameSize);
  maskImage.noErase();
  capture.mask(maskImage);
  // //invert pixels
  // const imgInverted = createGraphics(width,height);
  // imgInverted.loadPixels();
  // maskImage.loadPixels();
  // for (var i = 3; i < imgInverted.pixels.length; i+=4) {
  //   imgInverted.pixels[i] = 255-maskImage.pixels[i];
  // }
  // imgInverted.updatePixels();
  // //set mask
  // capture.mask(imgInverted);
}

function drawImage(){
  c.resize(width/frameSize, height/frameSize);
  c.set();
  c.updatePixels();
  image(c, mouseX, mouseY);
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
    console.log("CHANGE MY PICTURE");
    img = loadImage('https://picsum.photos/' + width + '/' + height, _img => {
      blendMode(blendmodes[0]);
      image(_img, width/2, height/2, width);
    });
  } else if (key === "c") {
    console.log("WEBCAM MODE ACTIVATE");
    webcamMode = !webcamMode;
    // image(capture, 0, 0, width);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
