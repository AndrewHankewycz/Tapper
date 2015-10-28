(function(){

  var CANVAS_WIDTH = window.innerWidth;    // get window width
  var CANVAS_HEIGHT = window.innerHeight;  // get window height

  // define function to load home page
  function loadHomePage(){
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
    $('body').html(newGame);

    // defining some stuff for click listeners and timers
    // TODO figure out clicking
    var good = false;
    function timeIt(){
      console.log("click");
      good = true;
      setTimeout(function(){
        // if(good)
          console.log("fire");
      }, 500);
      good = false;
    }
    function endIt(){
      good = false;
    }

    document.addEventListener("click", timeIt());
    // $(document).click(timeIt());
    $(document).mouseup(endIt());

    // begin game scripts
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

    // get a reference to the canvas created by Handlbars template
    var canvasElement = $('#game-canvas')[0];
    var canvas = canvasElement.getContext("2d");
    var player = new Player(CANVAS_WIDTH, CANVAS_HEIGHT, canvas);
    var bullets = [];   // array to store bullet objects
    var enemies = [];   // array to store enemy objects
    var GAME_OVER = false;

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

      bullets.forEach(function(bullet){
        bullet.update();
      });
      enemies.forEach(function(enemy){
        enemy.update();
      });

     // filters the array returning new array with all those that returned true
     bullets = bullets.filter(function(bullet){
       return bullet.active;
     });
     enemies = enemies.filter(function(enemy){
       return enemy.active;
     });

     checkBulletHits();
     checkEnemyKills();

     if(GAME_OVER){
       console.log("GAME OVER");
       gameOver();
     }
     if(Math.random() < .05) {
       enemies.push(new Enemy(CANVAS_WIDTH, CANVAS_HEIGHT, canvas));
     }
   }// end update()

   function gameOver(){
     enemies = [];   // clear array
     bullets = [];
     GAME_OVER = false;
   }// end gameOver()

   // redraws the canvas with all elements
   function draw() {
     canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
     player.draw();
     bullets.forEach(function(bullet){
       bullet.draw();
     });
     enemies.forEach(function(enemy){
       enemy.draw();
     });
   }// end draw()

   // checks for bullet collisions with enemies
   function checkBulletHits(){
     bullets.forEach(function(b){
       enemies.forEach(function(e){
         if(e.collision({x: b.x, y: b.y})){
           e.explode();
           b.explode();
         }
       }); // end for
     }); // end for
   }// end checkBulletHits()

   // check if any of the enemies have hit the player
   function checkEnemyKills(){
     enemies.forEach(function(e){
       if(player.collision({x: e.x, y: e.y, width: e.width, height: e.height})){
         gameOver();
       }
     });
   }// end checkEnemyKills()

   // add keyup listener for when arrow keys are pressed
   $(document).bind("keydown", function(event) {
     keyStatus[event.keyCode] = true;
   });

   // add keyup listener for when arrow keys are released
   $(document).bind("keyup", function(event) {
     keyStatus[event.keyCode] = false;
   });

   // add keyup listener for when arrow keys are released
   $(document).bind("touchstart", function(event) {
     var xPos = event.originalEvent.touches[0].pageX;
     player.move(xPos);
    //  keyStatus[event.keyCode] = false;
   });

 } // end loadHomePage()

 loadHomePage();

}());
