
var express     = require('express'),
    app         = express(),
    http        = require('http').Server(app),
    port        = 8000,
    io          = require('socket.io')(http),
    bodyParser  = require('body-parser');
    //middleware  = require('middleware.js');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
  var data = {};
  data.from = req.body.from;
  data.to = req.body.to;
  data.dir = req.body.direction;

  io.sockets.emit('call', data); 
  res.send("So long, and thanks for all the fish!");
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
