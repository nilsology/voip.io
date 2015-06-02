
var express     = require('express'),
    app         = express(),
    http        = require('http').Server(app),
    port        = 64591,
    io          = require('socket.io')(http),
    bodyParser  = require('body-parser');

var middleware = require('middleware.js');

var calls = {};

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
  var callId = req.body.callId;
  calls[callId].from = req.body.from;
  calls[callId].to = req.body.to;
  calls[callId].dir = req.body.direction;

  callHandler(calls[callId]);
  // XML-Response to socket.io
  res.send("So long, and thanks for all the fish!");
});

app.post("/hangup", function (request, response) {
  var callId = request.body.callId;

  var from = calls[callId]["from"]
  var to = calls[callId]["to"]

  console.log("hang up call from: " + from + " to: " + to + "with cause: " + request.body.cause);

  response.send();
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected'); 
  });

});

http.listen(port, function() {
  console.log('listening on *:'+port);
});
