var http = require('http');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// Twitter Streaming endpoint
TwitterStream.url = {
  host: 'stream.twitter.com',
  path: '/1/statuses/sample.json',
  port: 80
};

// Constructor 
function TwitterStream (username, password) {
  TwitterStream.url.headers = {
    authorization: this.authorization_header(username, password)
  };
  this.reset();
};

// TwitterStream emits events
util.inherits(TwitterStream, EventEmitter);

// Export module interface
exports.TwitterStream = TwitterStream;

// Compose authorization header
TwitterStream.prototype.authorization_header = function(username, password) {
  return "Basic " + new Buffer(username + ":" + password).toString('base64');
};

// Initialize Streaming request
TwitterStream.prototype.reset = function () {
  this.pending_data = "";
  var self = this;
  this.stream_request = http.request(TwitterStream.url, function(res) {
    if (res.statusCode == 200) {
      console.log('Connected to the streaming API');
      res.setEncoding('utf8');
      res.on('data', function (data) {
        self.fetchData(data);
      });
      res.on('end', function () {
        self.die();
      });
    } else if (res.statusCode == 401) {
      throw new Error('Wrong username or password');
    } else {
      console.log('Twitter status: ' + res.statusCode);
      console.log('Twitter headers: ' + JSON.stringify(res.headers));
      throw new Error('Invalid status code from the streaming API');
    }
  });
};

// Send streaming request
TwitterStream.prototype.start = function () {
  this.stream_request.end();
};

// Fetch tweets from
TwitterStream.prototype.fetchData = function (chunk) {
  this.pending_data += chunk;
  var tweets = this.pending_data.split('\r\n');
  if (tweets.length >= 2) {
    this.pending_data = tweets.pop();
    for(var i = 0; i < tweets.length; i++) {
      this.emit('new_tweet', tweets[i]);
    }
  }
};

// Streaming dies
TwitterStream.prototype.die = function () {
  console.log('Stream died');
  this.reset();
  this.emit('die');
};

// Attach listeners to a socket. Echoes tweets from the streaming API to the
// client and closes the socket if the streaming is closed.
TwitterStream.prototype.attach = function (socket) {
  var listeners = {
    new_tweet: function (tweet) {
      socket.write(tweet + "\r\n");
    },
    die: function () {
      socket.end();
    }
  };
  this.on('new_tweet', listeners.new_tweet);
  this.on('die', listeners.die);
  socket.listeners = listeners;
};

// Remove listeners from a closed socket
TwitterStream.prototype.detach = function (socket) {
  var listeners = socket.listeners;
  this.removeListener('new_tweet', listeners.new_tweet);
  this.removeListener('die', listeners.die);
};
