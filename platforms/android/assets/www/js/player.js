// constructor for player object
function Player(canvas_width, canvasHeight, canvas){
  // player instance variables
  this._CANVAS_WIDTH = canvas_width;
  this._CANVAS_HEIGHT = canvasHeight;
  this.color = "#00A";
  this.width = this._CANVAS_WIDTH / 3;
  this.height = 50;
  // this.x = (CANVAS_WIDTH / 2) - (this.width / 2);
  this._currentPos = 1;    // player starts in the middle
  this._y = this._CANVAS_HEIGHT - this.height;
  var _xPositions = [0, this._CANVAS_WIDTH / 3, (this._CANVAS_WIDTH / 3) * 2];   // lut for player x positions
  this._x = _xPositions[this._currentPos];

  console.log('page width' + this._CANVAS_WIDTH);
  console.log('my width' + this.width);
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
    bullets.push(new Bullet(this._CANVAS_WIDTH, this.centerPoint()));
  }

  // check for collisions with enemy
  this.collision = function(e){
    return e.y + e.height>= this._y;
  }
}
