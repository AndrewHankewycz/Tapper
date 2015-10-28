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
