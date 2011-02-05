var net = require('net'),
    TwitterStream = require('./twitter_stream.js').TwitterStream;

/* SET YOUR CREDENTIALS AND REMOVE COMMENT */
var username = 'your_username',
    password = 'your_password';
/*******************************************/

var twitter_stream = new TwitterStream(username, password);

var server = net.createServer();

server.once('connection', function (request, answer) {
  twitter_stream.start();
});

server.on('connection', function (socket) {
  console.log('New TCP connection');
  twitter_stream.attach(socket);
  
  socket.on('close', function () {
    console.log('TCP Connection closed');
    twitter_stream.detach(socket);
  });
  
  socket.on('timeout', function () {
    console.log('TCP Timeout');
    twitter_stream.detach(socket);
  });
});

server.listen('/tmp/tweets.sock');
console.log('Server running at /tmp/tweets.sock');
