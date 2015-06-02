var express     = require('express'),
    app         = express(),
    http        = require('http').Server(app),
    port        = 64591,
    io          = require('socket.io')(http),
    bodyParser  = require('body-parser');
    xml         = require('xml');

var ctrl =  require('./middleware');
var calls = {};

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
  var callId = req.body.callId,
      from = req.body.from,
      to = req.body.to,
      dir = req.body.direction;

  calls[callId] = { "from" : from, "to" : to, "dir" : dir };

  ctrl.callHandler(calls[callId]);
  // XML-Response to socket.io
  res.send(
    xml({ Response: [
      {_attr: { onHangup: 'http://' + req.headers.host + '/hangup' }}
      ] })
    );
});

app.post("/hangup", function (req, res) {
  ctrl.onHangup(calls[callId]);
  res.send();
});

io.on('connection', function(socket) {
  console.log('client ' + socket.id + ' connected');
  socket.on('disconnect', function() {
    console.log('client ' + socket.it + ' disconnected'); 
  });
});

http.listen(port, function() {
  console.log('listening on *:'+port);
});
