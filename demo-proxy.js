// A naive and basic web server and proxy to enable the demo to
// run locally for development and where wifi/web is slow or restricted.
// @msaunby

// You'll need to do 'npm install connect'
// (and http-proxy, serve-static, serve-index)
// the rest is part of the default node install.

var http = require('http'),
 connect = require('connect'),
 httpProxy = require('http-proxy'),
 fs = require("fs"),
 serveStatic = require('serve-static'),
 serveIndex = require('serve-index');

// This server serves the current directory on port 8080
// including directory listing.  Even when the proxy server
// isn't used http://localhost:8080 will find this.
connect().use(serveIndex(".")).use(serveStatic(".")).listen(8080);

var cached_index = 'cache/ec2_index';
var cached_data = 'cache/ec2_data';

// http://ec2-52-16-246-202.eu-west-1.compute.amazonaws.com:9000/molab-3dwx-ds/media/55896829e4b0b14cba17273c
connect().use(function (req, res) {
  if(req.url == '/molab-3dwx-ds/media/55896829e4b0b14cba17273c'){
      console.log('SENDING CACHED INDEX', req.url);
    static_file =  cached_index;
  }else if(req.url == '/molab-3dwx-ds/media/55896829e4b0b14cba17273c/data'){
      console.log('SENDING CACHED DATA', req.url);
    static_file =  cached_data;
  }else{
    static_file =  cached_data;
    console.log("SOMETHING ODD HAPPENED HERE");
  }
  fs.readFile(static_file, "binary", function(err, file) {
      res.writeHead(200,{
        'Access-Control-Allow-Origin':'*'
      });
      res.write(file, "binary");
      res.end();
    });
}).listen(8001);


// This server or port 8000 acts as a proxy server.
// Select localhost:8000 as your web proxy and all http
// requests will come here.  For all but the AWS data need
// for the app the request is passed to the original target.
// For the data we're serving the request is passed to
// localhost:8001 (see above).
//

var proxy = httpProxy.createProxyServer();

connect().use(function (req, res, next) {
    if(req.headers.host == "ec2-52-16-246-202.eu-west-1.compute.amazonaws.com:9000"){
      proxy.web(req, res, {target: 'http://localhost:8001'});
    }else{
      proxy.web(req, res, {target: 'http://' + req.headers.host});
    }
}).listen(8000);
