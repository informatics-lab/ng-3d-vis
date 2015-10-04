var http = require('http');
var connect = require('connect');
var httpProxy = require('http-proxy');
var fs = require("fs");

var proxy = httpProxy.createProxyServer();
var cached_index = 'cache/ec2_index';
var cached_data = 'cache/ec2_data';

// http://ec2-52-16-246-202.eu-west-1.compute.amazonaws.com:9000/molab-3dwx-ds/media/55896829e4b0b14cba17273c
http.createServer(function (req, res) {

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

var app = connect();

app.use(function (req, res, next) {
    //console.log('req host', req.headers.host);
    //console.log('req referer', req.headers.referer);
    //console.log('req', req._parsedUrl);
    console.log('req url', req.url);
    next();
  })
  .use(function (req, res, next) {
    var host = req.headers.host;
    if( host == 'localhost:8080'){
      next();
    }
    else{
      //console.log('cacheing host', req.headers.host);
      //console.log('cacheing path', req._parsedUrl.path);
      /*
      http.get({
        host: req.headers.host,
        path: req._parsedUrl.path
        }, function(response) {
          var body = '';
          response.on('data', function(d) {
            body += d;
          });
          response.on('end', function() {
            console.log('WE HAVE IT', body.length);
          });
      });
      */
      next();
    }
  })
  .use(function (req, res, next) {
    if(req.headers.host == "ec2-52-16-246-202.eu-west-1.compute.amazonaws.com:9000"){
      proxy.web(req, res, {target: 'http://localhost:8001'});
    }else{
      proxy.web(req, res, {target: 'http://' + req.headers.host});
    }
}).listen(8000);
