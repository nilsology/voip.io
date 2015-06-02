// build universal call handler


function callHandler(call) {

  if (call.dir === 'in') {

  }

}

function inCallHandler(call) {

  io.sockets.emit('call', data); 
  if (data.dir === 'in') {
    console.log('incoming call from: ' + data.from);
  }
}
