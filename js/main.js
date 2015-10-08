
(function () {

var canvas = document.getElementById("theCanvas"),
	context = canvas.getContext("2d"),
	canvas2 = document.getElementById("theCanvas2"),
	context2 = canvas2.getContext("2d"),

	Player  = {
		x: 150,
		y: 100,
		width: 20,
		height: 20,
		vx: 0,
		vy: 0,
		thrust: -10,
		speedLimit: 5,
		gravity: 0.5,
		touchingGround: false,
		energy: 100,
		color: "#fff",

		centerX: function() {
			return this.x + (this.width / 2);
		},
		centerY: function() {
			return this.y + (this.height / 2);
		},
		halfWidth: function() {
			return this.width / 2;
		},
		halfHeight: function() {
			return this.height / 2;
		}
	},

		Platform = {

		x: 150,
		y: 100,
		width: 20,
		height: 20,

		centerX: function() {
			return this.x + (this.width / 2);
		},
		centerY: function() {
			return this.y + (this.height / 2);
		},
		halfWidth: function() {
			return this.width / 2;
		},
		halfHeight: function() {
			return this.height / 2;
		}
	},

	map = [
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
		[1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
		[1,0,1,0,1,1,0,0,1,1,0,1,0,0,0,0,1],
		[1,0,1,0,1,1,0,0,1,1,0,1,0,0,0,0,1],
		[1,0,1,0,0,0,1,1,0,0,0,1,0,0,0,1,1],
		[1,0,0,1,1,0,0,0,0,1,1,0,0,0,1,1,1],
		[1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1],
		[1,0,0,0,1,0,0,1,0,1,0,0,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
	],

	platforms = [],
	SIZE = 30,
	SPACE = 0,
	ROWS = map.length,
	COLUMNS = map[0].length;

	window.addEventListener("keydown",onKeyDown,false);
	window.addEventListener("keyup",onKeyUp,false);

	drawMap();

	function onKeyDown() {

		switch (event.keyCode) {
	
			case 32:
			//if(Player.touchingGround) {
			Player.touchingGround = false;
			Player.vy = Player.thrust; 
			//}
			break;

			case 39: 
			Player.vx = 5;
			break;

			case 37:
			Player.vx = -5;
			break;
		}
	
		if (Player.x < 0) {
			Player.x = 0;
		}

		if (Player.x > canvas.width - Player.width) {
			Player.x = canvas.width - Player.width;
		}

		if (Player.y > canvas.height - Player.height) {
			Player.y = canvas.height - Player.height;
			Player.touchingGround = true;
		}
	}

	function onKeyUp() {

		Player.touchingGround = false;

		switch (event.keyCode) {

			case 37:
			Player.vx = 0;
			break;
		
			case 39:
			Player.vx = 0;
			break;
		}
	}

	main();
	
	function main() {
		
		window.setTimeout(main,20);

		context2.clearRect(0,0,canvas2.width,canvas2.height);
		context2.fillStyle = "#fff";
		context2.fillRect(Player.x,Player.y,Player.width,Player.height);

  
		if (Player.vx > Player.speedLimit) {
			Player.vx = Player.speedLimit;
		}
		if (Player.vx < -Player.speedLimit) {
			Player.vx = -Player.speedLimit;
		} 
		if (Player.vy > Player.speedLimit * 2) {
			Player.vy = Player.speedLimit * 2;
		} 

		Player.x += Player.vx;
		Player.y += Player.vy;
		Player.vy += Player.gravity;

		for (var i = 0; i < platforms.length; i++) {
		
			var collisionSide = blockRectangle(Player, platforms[i]);
		
			if (collisionSide === "bottom" && Player.vy >= 0) {
				console.log("touching!");
				Player.touchingGround = true;
				Player.vy = -Player.gravity;
			}
			else if (collisionSide === "top" && Player.vy <= 0) {
				Player.vy = 0;
			}
			else if (collisionSide === "right" && Player.vx >= 0) {
				Player.vx = 0;
			}
			else if (collisionSide === "left" && Player.vx <= 0) {
				Player.vx = 0;
			}
			if (collisionSide !== "bottom" && Player.vy > 0) {
				Player.touchingGround = false;
			}
		}
	}

	function drawMap() {

		for (var row = 0; row < ROWS; row++) {	
			for (var column = 0; column < COLUMNS; column++) {		 
			 
				switch(map[row][column]) {

					case 0: 
					context.fillStyle = "rgb(246, 139, 51)";
					break;
					
					case 1: context.fillStyle = "rgb(241, 90, 34)";
					p = Object.create(Platform);
					p.x = column * SIZE;
					p.y = row * SIZE;
					platforms.push(p);
					break;		
				}
				context.fillRect((column * SIZE), (row * SIZE),30,30);
			}
		}
	}

	function blockRectangle(r1, r2) {
	  
		var collisionSide,
			vx = r1.centerX() - r2.centerX(),
			vy = r1.centerY() - r2.centerY(),
			combinedHalfWidths = r1.halfWidth() + r2.halfWidth(),
			combinedHalfHeights = r1.halfHeight() + r2.halfHeight();
		
		if (Math.abs(vx) < combinedHalfWidths) {
			if (Math.abs(vy) < combinedHalfHeights) {
				var overlapX = combinedHalfWidths - Math.abs(vx);
				var overlapY = combinedHalfHeights - Math.abs(vy);
					
				if (overlapX >= overlapY) {
					if (vy > 0) {
						collisionSide = "top";
						r1.y = r1.y + overlapY;
					}
					else {
						collisionSide = "bottom";
						r1.y = r1.y - overlapY;
					}
				} 
				else {
					if (vx > 0) {
						collisionSide = "left";
						r1.x = r1.x + overlapX;
				}
					else  {
						collisionSide = "right";
						r1.x = r1.x - overlapX;
					}
				} 
			}
			else {
				collisionSide = "none";
			}
		} 
		else {
			collisionSide = "none";
		}
	  return collisionSide;
	}

  if(Player.vy > 0)
  {
    Player.touchingGround = false;
  }
 
})();

