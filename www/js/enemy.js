function Enemy(canvasWidth, canvasHeight, canvas){
  // instance variables
  this._canvas = canvas;
  this._CANVAS_WIDTH = canvasWidth;
  this._CANVAS_HEIGHT = canvasHeight;
  this.active = true;
  this.width = 40;
  this.height = 40;
  this.yVelocity = 3;   // moving downward
  var _start = Math.floor(Math.random() * 3);
  var _offset = (this._CANVAS_WIDTH / 3) / 2 - (this.width / 2);
  this._xPositions = [0 + _offset, (this._CANVAS_WIDTH / 3) + _offset, ((this._CANVAS_WIDTH / 3) * 2) + _offset];   // lut for player x positions
  this.x = this._xPositions[_start];
  this.y = 0;
  this._colors = ['#87DEDE', '#B387DE', "#B3DE87"]
  this.color = this._colors[Math.floor(Math.random()*3)];
  return this;
}

Enemy.prototype = {
  inBounds: function(){
    return this.x >= 0 && this.x <= this._CANVAS_WIDTH
       && this.y >= 0 && this.y <= this._CANVAS_HEIGHT;
  },
  draw: function(){
    this._canvas.fillStyle = this.color;
    this._canvas.fillRect(this.x, this.y, this.width, this.height);
  },
  update: function(){
    this.y += this.yVelocity;
    this.active = this.active && this.inBounds();
  },
  collision: function(b){
    return b.x >= this.x && b.x <= (this.x + this.height) &&
     b.y >= this.y && b.y <= (this.y + this.height);
  },
  explode: function(){
    this.active = false;
  }
};
