var express     = require('express'),
    app         = express(),
    http        = require('http').Server(app),
    port        = 64591,
    io          = require('socket.io')(http),
    bodyParser  = require('body-parser');
    xml         = require('xml');

var calls = {};

io.on('connection', function(socket) {
  console.log('client ' + socket.id + ' connected');
  socket.on('disconnect', function() {
    console.log('client ' + socket.id + ' disconnected');
  });
});

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

  callHandler(calls[callId]);
  // XML-Response to socket.io
  res.send(
    xml({ Response: [
      {_attr: { onHangup: 'http://' + req.headers.host + '/hangup' }}
      ] })
    );
});

app.post("/hangup", function (req, res) {
  onHangup(calls[callId]);
  res.send();
});

http.listen(port, function() {
  console.log('listening on *:'+port);
});

callHandler = function(callObj) {

  var call = callObj;

  if (call.dir === 'in') {
    inCallHandler(call);
  } else if (call.dir === 'out') {
    outCallHandler(call);
  }

}

inCallHandler = function(call) {
  io.sockets.emit('call', call); 
  console.log('incoming call from: ' + call.from);
  // log event
}

outCallHandler = function(call) {
  io.sockets.emit('call', call);
  console.log('outgoing call to: ' + call.to);
  // log event
}

onHangup = function(call) {

  console.log("hang up call from: " + call.from + " to: " + call.to + "with cause: " + call.why);
}
