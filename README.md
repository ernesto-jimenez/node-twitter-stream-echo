# Twitter Stream Echo

I wanted to code several scripts that would consume the Twitter Streaming API to get different stats with live data.

The [Rate Limiting for the streaming API][rate_limits] only allows one connection per IP address and blacklists IPs doing excessive connections:

> Each account may create only one standing connection to the Streaming API.
> Subsequent connections from the same account may cause previously established
> connections to be disconnected. Excessive connection attempts, regardless of
> success, will result in an automatic ban of the client's IP address.
> Continually failing connections will result in your IP address being
> blacklisted from all Twitter access.

I created this small service in order to be able to consume the streaming API from several scripts in my computer with one single connection and being able to restart the scripts without triggering reconnections to Twitter.

This small TCP service establishes one single connection to the Twitter Streaming API and echoes all the tweets to any client connected to the socket at `/tmp/tweets.sock`.

## Usage

1. Download the service: `git clone https://github.com/ernesto-jimenez/node-twitter-stream-echo.git`
2. Edit echo.js and type your twitter username and password.
3. Run the service: `node echo.js`
4. Connect to `/tmp/tweets.js` and have fun :)

You can test the service using telnet: `telnet /tmp/tweets.sock`

## MIT License

Copyright (C) 2011 by Ernesto Jiménez <erjica@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[rate_limits]: http://dev.twitter.com/pages/streaming_api_concepts#access-rate-limiting]