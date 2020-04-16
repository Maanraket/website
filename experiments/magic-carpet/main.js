//this variable will hold our shader object
let simpleShader;

function preload(){
  // a shader is composed of two parts, a vertex shader, and a fragment shader
  // the vertex shader prepares the vertices and geometry to be drawn
  // the fragment shader renders the actual pixel colors
  // loadShader() is asynchronous so it needs to be in preload
  // loadShader() first takes the filename of a vertex shader, and then a frag shader
  // these file types are usually .vert and .frag, but you can actually use anything. .glsl is another common one
  simpleShader = loadShader('basic.vert', 'basic.frag');
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

let counter = 0;
let zoom = 0;

function draw() {  
  // shader() sets the active shader with our shader
  shader(simpleShader);
  simpleShader.setUniform('ratio', windowHeight / windowWidth);
  simpleShader.setUniform('mouse', [mouseX / windowHeight, mouseY / windowHeight]);

  counter++;
  simpleShader.setUniform('counter', counter);

  if (mouseIsPressed) {
    zoom = zoom + 0.1;
  } else {
    zoom = zoom * 0.9;
  }
  simpleShader.setUniform('zoom', zoom);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (keyCode === 70) {
    fullscreen(!fullscreen());
  }
}