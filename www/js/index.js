var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      /* --------------------------------- Event Registration -------------------------------- */
      alert('ready');
      var html = "<div class='container-fluid'>" +
        "<h3>Welcome to the Game!</h3>" +
        "<p>Please click the button to begin a game</p>" +
        "<button type='button' id='play-btn' class='btn btn-default'>Play</button>" +
        "</div>";
      $('body').html(html);

      $('#play-btn').on('click', function() {
          $.get('test.txt', function(data) {
            alert(data);
          });
          alert("Play");
        });
    }
};

app.initialize();
