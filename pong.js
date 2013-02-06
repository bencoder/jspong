var PaddleObj = function() {
	this.init = function(game_object, side) {
		
	}
}

var BallObj = function() {

	this.init = function(game_object, initial_speed, pos_x, pos_y) {
		this.game = game_object;
		this.position = {x:pos_x, y:pos_y};
		this.vector = {x:initial_speed, y:initial_speed};
	}
	
	this.update = function(frame_time) {
		this.position.x += this.vector.x*frame_time;
		this.position.y += this.vector.y*frame_time;
		if (this.position.x > this.game.width) {
			this.position.x = this.game.width;
			this.vector.x *= -1;
		}
		if (this.position.x < 0) {
			this.position.x = 0;
			this.vector.x *= -1;
		}
		if (this.position.y < 0) {
			this.position.y = 0;
			this.vector.y *= -1;
		}
		if (this.position.y > this.game.height) {
			this.position.y = this.game.height;
			this.vector.y *= -1;
		}
	}
	
	this.render = function(ctx) {
		ctx.beginPath();
		ctx.fillStyle="white";
		ctx.arc(this.position.x, this.position.y, 10, 0 , 2 * Math.PI, false);
		ctx.fill();
		//ctx.stroke();
	}
	
}

var GameObj = function() {
	this.gameCanvas = document.createElement('canvas');

	this.setCanvasSize = function(width, height) {
		this.width = width;
		this.height = height;
		this.gameCanvas.width = width;
		this.gameCanvas.height = height;
	}
	
	this.init = function(parent, width, height) {
		this.setCanvasSize(width, height);
		parent.appendChild(this.gameCanvas);
		this.ball = new BallObj();
		this.ball.init(this, 100, width/2, height/2);
		this.previous_time = Date.now();
	}
	
	this.update = function(delta_time) {
		this.ball.update(delta_time);
	}
	
	this.drawFrame = function() {
		var ctx = this.gameCanvas.getContext("2d");
		ctx.fillStyle="black";
		ctx.fillRect(0,0,this.gameCanvas.width,this.gameCanvas.height);
		this.ball.render(ctx);
	}
	
	this.run = function(delta_time) {
		this.update(delta_time);
		this.drawFrame();
	}
}



var setup = function() {
	var div = document.getElementById('pongDiv');
	var game = new GameObj();
	game.init(div, 640, 480);
	var previous_time = 0;
	var frameCallback = function(timestamp) {
		if (previous_time == 0) {
			previous_time = timestamp;
		}
		//convert to seconds
		delta_time = (timestamp - previous_time)/1000;
		//fix the delta time to a max of 0.1 seconds, so that even if frame rate is really slow, the jumps don't get too big
		if (delta_time > 0.1)
			delta_time = 0.1;

		previous_time = timestamp;
		game.run(delta_time);
		window.requestAnimationFrame(frameCallback);
	}
	window.requestAnimationFrame(frameCallback);
	/*
	window.onresize = function() {
		game.setCanvasSize(window.innerWidth, window.innerHeight);
	}
	*/
}


