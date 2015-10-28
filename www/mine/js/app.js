// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var service = new EmployeeService();
    service.initialize().done(function () {
        renderHomeView();
    });

    /* --------------------------------- Event Registration -------------------------------- */
    $('.search-key').on('keyup', findByName);
    $('.help-btn').on('click', function() {
        alert("Employee Directory v3.4");
    });

    /* ---------------------------------- Local Functions ---------------------------------- */
    function findByName() {

    }

    function renderHomeView() {
      var html =
      "<div class='container-fluid'>" +
          "<h3>Welcome to the Game!</h3>" +
          "<p>Please click the button to begin a game</p>" +
          "<form action='/android/www/game.html'>" +
            "<input type='submit' value='Play'>" +
          "</form>" +
        "</div>";
      $('body').html(html);
      $('.search-key').on('keyup', findByName);
    }

}());
