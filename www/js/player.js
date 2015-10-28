function Bullet(canvasWidth, startPos){
  // instance variables
  this._CANVAS_WIDTH = canvasWidth;
  this.active = true;
  this.yVelocity = -6;   // moving upward
  this.x = startPos.x;
  this.y = startPos.y;
  this.width = 5;
  this.height = 5;
  this.color = "#00A";

  return this;
}

Bullet.prototype = {
  inBounds: function(){
    var inside = this.x >= 0 && this.x <= this._CANVAS_WIDTH
       && this.y >= 0 && this.y <= this._CANVAS_HEIGHT;
    if(!inside)
       GAME_OVER = true;
    return inside;
  },
  draw: function(){
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  },
  update: function(){
    this.y += this.yVelocity;
    this.active = this.active && this.inBounds();
  },
  explode: function(){
    this.active = false;
  }
};


// constructor for player object
function Player(canvas_width, canvasHeight, canvas, bullets){
  // player instance variables
  this._CANVAS_WIDTH = canvas_width;
  this._CANVAS_HEIGHT = canvasHeight;
  this._bullets = bullets;
  this.color = "#00A";
  this.width = this._CANVAS_WIDTH / 3;
  this.height = 50;
  // this.x = (CANVAS_WIDTH / 2) - (this.width / 2);
  this._currentPos = 1;    // player starts in the middle
  this._y = this._CANVAS_HEIGHT - this.height;
  var _xPositions = [0, this._CANVAS_WIDTH / 3, (this._CANVAS_WIDTH / 3) * 2];   // lut for player x positions
  this._x = _xPositions[this._currentPos];

  // draw player
  this.draw = function(){
    canvas.fillStyle = this.color;
    canvas.fillRect(this._x, this._y, this.width, this.height);
  }

  // moves player position to left
  this.moveLeft = function(){
    if(this._currentPos > 0){
      this._currentPos--;
      this._x = _xPositions[this._currentPos];
    }
  }

  // moves player position to right
  this.moveRight = function(){
    if(this._currentPos < 2){
      this._currentPos++;
      this._x = _xPositions[this._currentPos];
    }
  }

  // moves player depending on xPos
  this.move = function(xPos){
    var step = this.width;
    var pos = Math.floor(xPos / step);
    this._x = _xPositions[pos];
  }

  // get coords of player center point
  this.centerPoint = function(){
    return {x:this._x + (this.width / 2), y: this._CANVAS_HEIGHT - this.height};
  }

  // get player x position
  this.getX = function(){
    return this._x;
  }

  // get player y position
  this.getY = function(){
    return this._y;
  }

  // player shoots a missile
  this.shoot = function(){
    this._bullets.push(new Bullet(this._CANVAS_WIDTH, this.centerPoint()));
  }

  // check for collisions with enemy
  this.collision = function(e){
    return e.y + e.height>= this._y;
  }
}
