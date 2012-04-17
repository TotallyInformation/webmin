
/**
 * @see http://expressjs.com/guide.htm
 * @see http://www.senchalabs.org/connect
 * @see http://nodemanual.org/latest/nodejs_dev_guide/index.html
 * @see ** http://www.hacksparrow.com/express-js-tutorial.html **
 *
 * Markdown: https://github.com/visionmedia/node-discount, https://github.com/evilstreak/markdown-js
 *
 * TODO
 *  - Add a port 80 listener and redirect to https
 *  - Add reverse proxy capabilities
 * 
 */

var express = require('express')
  , routes = require('./routes')
  , portfinder = require('portfinder')
  , fs = require('fs')
  , log = require('util').log
  ;
  
require('date-utils');

var options = {
  key: fs.readFileSync('/etc/ssl/private/totallyinformation.key'),
  cert: fs.readFileSync('/etc/ssl/private/totallyinformation.crt')
};

// Simply pass key & cert to get https instead of http!
var app = module.exports = express.createServer(options);

// Configuration

app.configure(function(){
  // Sets the Jade view controller/templating engine active
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  // Set rendered Jade output to include whitespace for debugging
  // app.set('view options', { pretty: true });
  // -- alt common view engines are: Haml, Jade, EJS, CoffeeKup, jQuery Templates --
  
  // parse the request body & populate req.body
  app.use(express.bodyParser());
  // checks req.body.method for http method override
  app.use(express.methodOverride());
  
  // Log requests to the console - need to change this for dev/prod use
  // @see http://www.senchalabs.org/connect/middleware-logger.html
  app.use(express.logger( { immediate: true, format: ':date :url :method :status [:req[authorization] :response-time :res[content-length]] :remote-addr [Referer: :referrer]' } ) );
  // add a response-time header
  app.use(express.responseTime()); 
  // Simplistic basic auth - user challanged for id & pw - callback returns true/false and request.user is set on true
  // User is not re-requested if already set
  // req.headers.authorization.split(" ")[0] == 'Basic' if user is logged in
  app.use(express.basicAuth(function(user, pass){
    return 'julian' == user & 'Jk.BHost' == pass;
  }) );
  
  // Dispatch incoming request URL's to relavent controllers
  app.use(app.router);
  
  // Serve static files, NB: URL is relative to root (e.g. http://xyz.com/) but folder is as specified (e.g. /var/nodejs/webmin/static/)
  app.use(express.static(__dirname + '/public')); // test with /basic.html
  
  // Need error handler here
  //app.use(express.errorHandler(...));

});

// Configure dev specific
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// to use prod, call with `NODE_ENV=production node app.js`
app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes - any files in fldr "./routes" are require()'d & exported functions can be ref'd here

// Default root route! "/*" accepts ALL routes
app.get('/cmdexec', routes.cmdexec);
app.post('/cmdexec', routes.cmdexec);
app.get('/utime', routes.utime);
app.get('/top', routes.cmdtop);
app.get('/ports', routes.cmdports);
app.get('/test', routes.test);
app.get('/', routes.index);
/* Examples of routing 
// Create a new run
app.post('/runs', function(request, response) { });
// Show run
app.get('/runs/:id', function(request, response) { });
// Edit run
app.get('/runs/:id/edit', function(request, response) { });
// Update run
app.put('/runs/:id', function(request, response) { });
// Delete run
app.delete('/runs/:id', function(request, response) { });
*/
 
portfinder.getPort(function (err, port) {
	if (err) {
	  return console.log(err);
	}
	// `port` is guarenteed to be a free port 
	// By default portfinder will start searching from 8000. To change this simply set portfinder.basePort
	//https.createServer(options, app).listen(port, function(){
	app.listen(port, function(){
	  var myNow = new Date();	
	  console.log("%s Express server listening on port %d in %s mode", myNow.toFormat('YYYY-MM-DD HH24:MI:SS '), app.address().port, app.settings.env);
	});
});
