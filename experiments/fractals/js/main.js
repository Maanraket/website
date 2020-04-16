//mostly old shitty code down here

//some global variables:
var _width = 1900,
	_height = 900,
	stepRes = 300,
	threshold = 128,
	mousePositionX,
	mousePositionY,
	zoomSpeed = 0.0005;

//Custom pixi filter in order to compute the fractal on the gpu

PIXI.FractalFilter = function() {
    PIXI.AbstractFilter.call(this);

    this.passes = [ this ];

    this.uniforms = {
        resolution: {type: '2f', value: {x: _width, y: _height}},
        minSet: {type: '2f', value: {x: -2.5, y: -1}},
        maxSet: {type: '2f', value: {x: 1, y: 1}},
        threshold: {type: '1f', value: threshold},
        animator: {type: '1f', value: 0},
        stepRes: {type: '1f', value: stepRes},
				zoomLevel: {type: '1f', value: 1}
    }

    this.fragmentSrc = [
	    'precision highp float;',
			'uniform highp vec2 resolution;',
			'uniform highp vec2 minSet;',
			'uniform highp vec2 maxSet;',
			'uniform float threshold;',
			'uniform highp float animator;',
			'uniform highp float stepRes;',
			'uniform float zoomLevel;',

	    'void main(void) {',
			'vec2 scaledPosition = vec2((gl_FragCoord.x / resolution.x) * (maxSet.x - minSet.x) + minSet.x, (gl_FragCoord.y / resolution.y) * (maxSet.y - minSet.y) + minSet.y);',
			'vec2 newPosition = vec2(0.5 + sin (.1 + animator / stepRes * 3.14 * 2.), 0.5 + sin (.1 + (stepRes - animator) / stepRes * 3.14 * 2.));',
			'float counter = 0.;',
			'float r = 0.;',
			'float g = 0.;',
			'float b = 0.;',
			'const int iterations = 100;',
			'for(int i = 0; i < iterations; i++){',
				'float squared = newPosition.x * newPosition.x + newPosition.y * newPosition.y;',
				'if(squared > 2.*2. || i >= iterations - 1){',
					'counter = float(i) + squared / 5000. * ( animator * -7.);',
					'r = sqrt((sin(counter + animator * sqrt(zoomLevel) * 0.1) + 1.) / 2.);',
					'g = (sin(counter * 1.5) + 1.) / 2.;',
					'b = pow((sin(counter * 2.5) + 1.) / 2., 1.2);',
					'if(i >= iterations - 1){',
						'r = 0.;',
						'g = .1;',
						'b = .3;',
					'}',
					'break;',
				'}',
				'float xTemp = newPosition.x * newPosition.x - newPosition.y * newPosition.y + scaledPosition.x;',
				'newPosition.y = 2.*newPosition.x*newPosition.y+scaledPosition.y;',
				'newPosition.x = xTemp;',
			'}',
			'gl_FragColor = vec4(r, g, b, 1.0);',
	    '}'
	];
};

PIXI.FractalFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.FractalFilter.prototype.constructor = PIXI.FractalFilter;

var stage = new PIXI.Stage(0x000000);
var renderer = PIXI.autoDetectRenderer(_width, _height);

var fractal = new PIXI.Sprite;

fractal.position.x = 0;
fractal.position.y = 0;
fractal.width = _width;
fractal.height = _height;

var FractalFilter = new PIXI.FractalFilter();
fractal.filters = [FractalFilter];

stage.addChild(fractal);

//------------------------------------------------------------------------------

var scrollZoom = 0;

var animationPlay = true;
var animationPosition = 500;
var animationCounter = 0.5;
var animationSpeed = 0.25;

var oldMousePosition, newMousePosition, currentPosition;
var stageDragging = false;

var speedometerOpacity = 0;

$(document).ready(function(){
	document.body.appendChild(renderer.view);

	requestAnimFrame(animate);
	function animate() {
		newMousePosition = currentPosition;
		//do things with mouse position

		var xLength = FractalFilter.uniforms.maxSet.value.x - FractalFilter.uniforms.minSet.value.x;
		var yLength = FractalFilter.uniforms.maxSet.value.y - FractalFilter.uniforms.minSet.value.y;

		if(stageDragging && oldMousePosition){
			xMovement = (newMousePosition.x - oldMousePosition.x)/_width;
			yMovement = (newMousePosition.y - oldMousePosition.y)/_height;

			FractalFilter.uniforms.minSet.value.x -= xLength * xMovement ;
			FractalFilter.uniforms.minSet.value.y += yLength * yMovement ;
			FractalFilter.uniforms.maxSet.value.x -= xLength * xMovement ;
			FractalFilter.uniforms.maxSet.value.y += yLength * yMovement ;
			if(Math.abs(xMovement * xLength * yMovement * yLength) * 1000 > 0.01){
				panTutorialComplete = true;
				$('.hint.pan').hide();
			}
		}

		//animate by zooming in towards mouse cursor
		if(stage.getMousePosition().x > 0){
			mousePositionX = stage.getMousePosition().x/_width;
			mousePositionY = stage.getMousePosition().y/_height;
			var setRatio = (xLength)/(yLength);
			FractalFilter.uniforms.minSet.value.x += xLength * scrollZoom * (mousePositionX);
			FractalFilter.uniforms.minSet.value.y += yLength * scrollZoom * (1-mousePositionY);
			FractalFilter.uniforms.maxSet.value.x -= xLength * scrollZoom * (1-mousePositionX);
			FractalFilter.uniforms.maxSet.value.y -= yLength * scrollZoom * (mousePositionY);
		}

		//animate with starting positions of x and y
		if(animationPlay){
			var zoomFactor = Math.pow(xLength / _width / 1000, .75);
			animationPosition = Math.sin(animationCounter*2*Math.PI)*-500+100;
			animationCounter += animationSpeed * zoomFactor;
		}
		FractalFilter.uniforms.zoomLevel.value = _width / xLength;
		FractalFilter.uniforms.animator.value = animationPosition;
		console.log(animationPosition);
		renderer.render(stage);

		scrollZoom = scrollZoom * .8;
		oldMousePosition = newMousePosition;

		speedometerOpacity = speedometerOpacity * .8;
		$('.speedometer').css({opacity: speedometerOpacity});

		requestAnimFrame(animate);
	}

	//Panning

	stage.mousedown = function(){
		stageDragging = true;
	}

	stage.touchstart = function(e){
		updateMousePosition(e);
		newMousePosition = currentPosition;
		oldMousePosition = currentPosition;
		stageDragging = true;
	}

	stage.touchend = function(){
		stageDragging = false;
	}

	stage.mouseup = function(){
		stageDragging = false;
	}
	stage.mouseout = function(){
		stageDragging = false;
	}

	stage.mousemove = function(e){
		updateMousePosition(e);
	}

	stage.touchmove = function(e){
		updateMousePosition(e);
	}

	function updateMousePosition(e){
		currentPosition = {
			x: e.getLocalPosition(fractal).x * _width,
			y: e.getLocalPosition(fractal).y * _height
		};
	}

	$(window).keypress(function (e) {
		e.preventDefault();
	  if (e.key === 'p') {
			stopStart();
		}
	});

	function stopStart(){
		animationPlay = !animationPlay;
	}

	$('.hint').on('click', function(){
		$(this).hide();
	})

});

function resizeHandler(e){
	_width = $(document).width();
	_height = $(document).height();
	FractalFilter.uniforms.resolution.value.x = _width;
	FractalFilter.uniforms.resolution.value.y = _height;
	fractal.width = _width;
	fractal.height = _height;
	renderer.resize(_width,_height);
}


$(window).on('resize', resizeHandler);

resizeHandler();

var zoomTutorialComplete = false;
var speedTutorialComplete = false;
var panTutorialComplete = false;

$('.hint.speed').hide();
$('.hint.pan').hide();

$(document).mousewheel(function(e){
	animationSpeed += e.deltaX * e.deltaFactor / 1000;
	if(animationSpeed > 1) animationSpeed = 1;
	if(animationSpeed < -1) animationSpeed = -1;

	if(e.deltaX != 0){
		speedometerOpacity += e.deltaX*e.deltaX/20;
		speedometerOpacity = Math.min(1, speedometerOpacity);
		$('.speedometer .indicator').css({
			transform: 'rotateY(' + ((1 - animationSpeed) / 4) + 'turn)'
		})
	}


	scrollZoom += e.deltaY * e.deltaFactor/10000;

	if(!zoomTutorialComplete){
		var zoomLevel = (FractalFilter.uniforms.maxSet.value.x - FractalFilter.uniforms.minSet.value.x);
		if(zoomLevel < 1){
			zoomTutorialComplete = true;
			$('.hint.zoom').hide();
			if(!speedTutorialComplete){
				$('.hint.speed').show();
			}
		}
	} else if(!speedTutorialComplete){
		if(animationSpeed < 0){
			speedTutorialComplete = true;
			$('.hint.speed').hide();
			if(!panTutorialComplete){
				$('.hint.pan').show();
			}
		}
	}
	e.preventDefault();
});

if(console){
	console.log("yes, I know the code isn't pretty. Lots of magic numbers, but a lot of fun to make");
}
