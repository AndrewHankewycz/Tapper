(function(){

  var CANVAS_WIDTH = window.innerWidth;    // get window width
  var CANVAS_HEIGHT = window.innerHeight;  // get window height
  // used to look up the status of a key, given key name -> find index in status
  var keyCode = {
    'left': 37,
    'right': 39,
    'space': 32
  };
  // used to store status of keys pressed, event.keyCode is used as key
  var keyStatus = {
    // left, right, space
    37: false,
    39: false,
    32: false
  }
  var enemies = [];   // array to store enemy objects
  var score;    // reference to score object
  var GAME_OVER = false;

  function Bullet(canvasWidth, canvasHeight, position, canvas){
    // instance variables
    this._CANVAS_WIDTH = canvasWidth;
    this._CANVAS_HEIGHT = canvasHeight;
    this.canvas = canvas;
    this.active = true;
    this.yVelocity = -6;   // moving upward
    this.x = position.x;
    this.y = position.y;
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
         GAME_OVER = true;    // game over is still in scope here
      return inside;
    },
    draw: function(){
      this.canvas.fillStyle = this.color;
      this.canvas.fillRect(this.x, this.y, this.width, this.height);
    },
    update: function(){
      this.y += this.yVelocity;
      this.active = this.active && this.inBounds();
    },
    explode: function(){
      this.active = false;
    }
  };

  function BulletManager(canvas){
    // instance variables
    this.bullets = [];
    this.canvas = canvas;
    this.score = score;
  }

  BulletManager.prototype = {
    // adds a new bullet to the game
    fireBullet: function(position){
      this.bullets.push(new Bullet(CANVAS_WIDTH, CANVAS_HEIGHT, position, this.canvas));
    },
    // updates bullet position based on its velocity
    updateBullets: function(){
      this.bullets.forEach(function(bullet){
        bullet.update();
      });
    },
    // bullets set to !active would have exploded or went outside bounds
    checkActiveBullets: function(){
      this.bullets = this.bullets.filter(function(bullet){
        return bullet.active
      });
    },
    // checks for bullet collisions with enemies
    checkBulletHits: function(){
      this.bullets.forEach(function(b){
        enemies.forEach(function(e){
          if(e.collision({x: b.x, y: b.y})){
            e.explode();
            b.explode();
            score.increment();
          }
        }); // end for
      }); // end for
    },// end checkBulletHits()
    drawBullets: function(){
      this.bullets.forEach(function(bullet){
        bullet.draw();
      });
    },
    clearBullets: function(){
      this.bullets = [];
    }
  };

  function GameManager(){
    // instance variables
    this._defaultSpawnRate = .015;
    this.enemySpawnRate = this._defaultSpawnRate;
  }

  GameManager.prototype = {
    // increases enemy spawn rate
    increaseSpawnRate: function(){
      this.enemySpawnRate += .005;
    },

    // resets the respawn rate when playe loses
    resetSpawnRate: function(){
      this.enemySpawnRate = this._defaultSpawnRate;
    }
  }

  var bulletMgr;    // create empty pointer for BulletManager

  // define function to load game
  function loadGamePage(){
    // compile Handlebars template for game canvas
    var gameTpl = Handlebars.compile($("#game-tpl").html());

    // create context to pass to Handlebars template
    var context = {
      'width': CANVAS_WIDTH,
      'height': CANVAS_HEIGHT
    };

    // pass context to Handlebars template
    var newGame = gameTpl(context);
    // add template to page
    $('.content-placeholder').html(newGame);

    // get a reference to the canvas created by Handlbars template
    var canvasElement = $('#game-canvas')[0];
    var canvas = canvasElement.getContext("2d");
    // var enemies = [];   // array to store enemy objects
    bulletMgr = new BulletManager(canvas);
    var player = new Player(CANVAS_WIDTH, CANVAS_HEIGHT, canvas, bulletMgr);
    var gameManager = new GameManager();
    score = new Score(CANVAS_WIDTH, CANVAS_HEIGHT, canvas, gameManager);
    // var GAME_OVER = false;

    var FPS = 30;
    setInterval(function() {
      update();
      draw();
    }, 1000/FPS);

    // calls update method of each bullet so they can refresh their position
    function update(){
      if (keyStatus[keyCode['left']]) {
        player.moveLeft();
        keyStatus[keyCode['left']] = false;    // move has been acknowledged
      }
      if (keyStatus[keyCode['right']]) {
        player.moveRight();
        keyStatus[keyCode['right']] = false;    // move has been acknowledged
      }if (keyStatus[keyCode['space']]) {
        player.shoot();
        keyStatus[keyCode['space']] = false;    // move has been acknowledged
      }

      // move all bullets
      bulletMgr.updateBullets();
      // move all enemies
      enemies.forEach(function(enemy){
        enemy.update();
      });

      // check if any bullets need to be filtered because they were
      bulletMgr.checkActiveBullets();
      enemies = enemies.filter(function(enemy){
        return enemy.active;
      });

      // check if any bullets ahve collided with an enemy
      bulletMgr.checkBulletHits();
      // check it any enemies have collided with the player
      checkEnemyKills();

      if(GAME_OVER){
        console.log("GAME OVER");
        gameOver();
      }
      if(Math.random() < gameManager.enemySpawnRate) {
        enemies.push(new Enemy(CANVAS_WIDTH, CANVAS_HEIGHT, canvas));
      }
    }// end update()

   function gameOver(){
     enemies = [];   // clear array
     bulletMgr.clearBullets();  // empty bullet list
     score.reset();
     gameManager.resetSpawnRate();
     GAME_OVER = false;
   }// end gameOver()

   // redraws the canvas with all elements
   function draw() {
     canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
     player.draw();
     score.draw();
     bulletMgr.drawBullets();
     enemies.forEach(function(enemy){
       enemy.draw();
     });
   }// end draw()

   // check if any of the enemies have hit the player
   function checkEnemyKills(){
     enemies.forEach(function(e){
       if(player.collision({x: e.x, y: e.y, width: e.width, height: e.height})){
         gameOver();
       }
     });
   }// end checkEnemyKills()

   // defining a variable to store timer interval for charging
   var charge;

   function startCharge(){
     charge = setInterval(function(){
       // if the player hasnt released their touch yet
       player.incrementChargeStep();
     }, 15);
   }

   function stopCharge(){
     // clear the finger hold interval event
     clearInterval(charge);
     // if the player has reached the charge threashold, shoot
     if(player.chargeFinished()){
       player.shoot();
     }
     // clear the player charge value
     player.clearCharge();
   }

   // add keyup listener for when screen touch is pressed
   $(document).on("touchstart", function(event) {
     var xPos = event.originalEvent.touches[0].pageX;
     player.move(xPos);
     startCharge();
   });

   // add keyup listener for when screen touch is released
   $(document).on("touchend", function(event) {
     stopCharge();
   });

 } // end loadGamePage()

 // define function to load home page
 function loadHomePage(){
   // compile Handlebars template for home page
   var homeTpl = Handlebars.compile($("#home-tpl").html());

   // add home template to page
   $('.content-placeholder').html(homeTpl);

   // listen for button to be pressed, then load game
   $('#start-btn').on("click", function(){
     loadGamePage()
   });
} // end loadHomePage();

 loadHomePage();
 // loadGamePage();

}());
