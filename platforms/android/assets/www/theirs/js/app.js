// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */

    /* --------------------------------- Event Registration -------------------------------- */
    $('.help-btn').on('click', function() {
        alert("Employee Directory v3.4");
      });
    $('#play-btn').on('click', function() {
        alert("Play");
      });
      document.addEventListener('deviceready', function () {
        if (navigator.notification) { // Override default HTML alert with native dialog
          window.alert = function (message) {
            navigator.notification.alert(
              message,    // message
              null,       // callback
              "Workshop", // title
              'OK'        // buttonName
            );
          };
        }
      }, false);

    /* ---------------------------------- Local Functions ---------------------------------- */

    function renderHomeView() {
      var html =
      "<div class='container-fluid'>" +
          "<h3>Welcome to the Game!</h3>" +
          "<p>Please click the button to begin a game</p>" +
          "<button type='button' id='play-btn' class='btn btn-default'>Default</button>" +
          "<form action='/android/www/game.html'>" +
            "<input type='submit' value='Play'>" +
          "</form>" +
        "</div>";
      $('body').html(html);
      $('.search-key').on('keyup', findByName);
    }

}());
