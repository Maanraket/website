(function(){ 
    var _width = 320;
    var _height = 320;

	// You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
    var renderer = new PIXI.WebGLRenderer(_width,_height,{transparent: true});
    renderer.clearBeforeRender = false;
    renderer.blendModeManager.setBlendMode(1);
    renderer.mapBlendModes();
    var canvas1 = document.body.appendChild(renderer.view);

    var stage = new PIXI.Stage;
    var numberStars, starContainers,speed;
    starTexture = PIXI.Texture.fromImage("img/dot.png");

    var param = {
        amountOfStars: 25000,           // the amount of stars spawned at a time
        destinationsize: 5,             // determines the circle that the stars want to go towards (e.g. 5 times your screensize)
        velocity: 6,                    // the speed of the stars coming towards the screen
        impact: 10,                     // the amount of influence the mouse has on the scene (I like 10)
        deviatonmultiplier: 0.45,       // the amount of deviation that the scene generates by itself
        stretch: 1.5                    // amplifies the length of the stars when they gain more speed (for the warpspeed effect!)
    }

    function starvaganza(amount){
        starContainers = [];
        stage.removeChildren();
        numberStars = amount;
        for(var i=0;i<numberStars;i++){
            star =  new PIXI.Sprite(starTexture);

            var angle = Math.random()*Math.PI*2;

            star.scale.x = .2;
            star.scale.y = .2;
            star.alpha = .6;

            starContainers.push({
                star: star,
                x: _width/2 + (Math.cos(angle)*(_width/2)*param.destinationsize*(0.80+Math.random()*.4)),
                y: _width/2 + (Math.sin(angle)*(_width/2)*param.destinationsize*(0.80+Math.random()*.4)),
                step: Math.round(Math.random()*1000),
                angle: angle
            });
            stage.addChild(star);
        }
    }
    starvaganza(param.amountOfStars);
    
    requestAnimationFrame(animate);
    var mousePos = {x:_width/2,y:_height/2};
    var counter = 0;
    var mouseEasing = 0.05;
    function animate() {
        counter++;
        mousePos = stage.getMousePosition().x > 0 ? {x:mousePos.x * (1-mouseEasing) + stage.getMousePosition().x*mouseEasing, y:mousePos.y * (1-mouseEasing) + stage.getMousePosition().y*mouseEasing} : mousePos;
        var deviation = {x:(mousePos.x-_width/2)/(_width*(1/param.impact)) + param.deviatonmultiplier*Math.sin(counter/100), y:(mousePos.y-_height/2)/(_height*(1/param.impact)) + param.deviatonmultiplier*Math.sin(counter/80+1.5)};
        
        for(var i=0;i<numberStars;i++){
            var stepSize = (Math.sqrt(Math.abs(starContainers[i].x) + Math.abs(starContainers[i].y)) * (Math.pow(starContainers[i].step,3)/100000) * (0.90+Math.random()*.2))*param.velocity; 
            starContainers[i].step = starContainers[i].step < 2000 ? starContainers[i].step + stepSize: Math.random()*5;
            starContainers[i].star.position.x = _width /2 + starContainers[i].x * Math.pow(starContainers[i].step,2)/50 + deviation.x*_width *starContainers[i].step/50;
            starContainers[i].star.position.y = _height/2 + starContainers[i].y * Math.pow(starContainers[i].step,2)/50 + deviation.y*_height*starContainers[i].step/50;
            starContainers[i].star.scale.y = Math.pow(starContainers[i].step,2)/(2/param.stretch);
            starContainers[i].star.rotation = starContainers[i].angle+Math.PI/2;
        }
        renderer.render(stage);
        requestAnimationFrame(animate);
    }

    $(document).ready(function() {
	    $('#controls').mouseup(function(){
	    	if(document.getElementById('amountOfStars').value!==param.amountOfStars){
	    		param.amountOfStars = document.getElementById('amountOfStars').value;
	    		starvaganza(param.amountOfStars);
	    	} else if(document.getElementById('destinationsize').value!==param.destinationsize){
	    		param.destinationsize = document.getElementById('destinationsize').value;
	    		starvaganza(param.amountOfStars);
	    	}
	        param.velocity = document.getElementById('velocity').value;
	        param.impact = document.getElementById('impact').value;
	        param.deviatonmultiplier = document.getElementById('deviationmultiplier').value;
	        param.stretch = document.getElementById('stretch').value;
	    });

        $('#mute-toggle').change(function() {
            if($(this).is(":checked")) {
                player.mute();
                return;
            }
            player.unMute();
        });
	});

    var resizeHandler = function(event) {
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

        _width = x;
        _height = y;
        renderer.resize(x,y);
        starvaganza(param.amountOfStars);
    };
    window.onresize = resizeHandler;
    window.onload = resizeHandler;
})();