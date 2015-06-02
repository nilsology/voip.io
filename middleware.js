var express     = require('express'),
    app         = express(),
    http        = require('http').Server(app),
    io          = require('socket.io')(http),

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
  io.sockets.etmit('call', call);
  console.log('outgoing call to: ' + call.to);
  // log event
}

onHangup = function(call) {

  console.log("hang up call from: " + call.from + " to: " + call.to + "with cause: " + call.why);
}

// db connection to check entries for callHandling
//
//
// TODO:  * collect data to allow stats
//        *  

exports.callHandler = callHandler;
exports.inCallHandler = inCallHandler;
exports.outCallHandler = outCallHandler;
exports.onHangup = onHangup;

