var log     = require('util').log
  , inspect = require('util').inspect
  ;

function secondsToString(seconds) {
  // Convert seconds to D, H, m, s. e.g. for uptime
  var numdays = Math.floor(seconds / 86400);
  var numhours = Math.floor((seconds % 86400) / 3600);
  var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
  var numseconds = ((seconds % 86400) % 3600) % 60;
  
  return numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds (" + seconds + ")";
}

// Helper function to run a command - WARN: this is sync
// When calling, pass a callback function as the last parm, this will recieve the stdout & std err
function jk_cmd(cmd, callback) {
  // NB: Max buffer is limited to 200*1024 for exec - use SPAWN if needing more
  //	  Default timeout is 0, changed to 2 sec (2000)
  var exec = require('child_process').exec
  child = exec(cmd, {timeout: 2000}, function(error, stdout, stderr) {
       log('CMD Requested: `' + cmd + '`');
	if (error) {
		callback('--Command Failed--',inspect(error));
	} else {
		// Execute the callback
		callback(stdout, stderr);
	}
  });
}

var links = {
    'Home'    : '/'
  , 'Test'    : '/test'
  , 'Uptime'  : '/utime'
  , 'Top' : '/top'
  , 'List Open Ports' : '/ports'
  , 'Command' : '/cmdexec'
  , 'Edit Files' : '/fsedit'
  , 'View Log Files' : '/'
  , 'Service Restart' : '/'
}
/*
 * Commands to try:
 *  tail --lines=50 /var/log/syslog
 *  Service restart: /etc/init.d/???? restart
 *  List server docs
 *  Man/info/docs
 *  Aptitude/npm/pecl
 */

// Default parameters for cmdexec.jade template
var cmdParams = {};
// We have to reset these for each cmd... fn call
function setCmdParams() {
  cmdParams = {
      title: 'Command Output'
    , results: ''
    , errors: ''
    , cmd: ''
    , showform: true
    , other: ''
    , lblCommand: 'Command: '
    , cmdHint: "Enter a command"
    , btnTxt: "Submit"
    //, layout: "layoutname"
    , links: links
  };
}

/*
 * Functions to render pages
 */

exports.index = function(req, res){
  res.render('index', { 
    title: 'Node.js Webmin Replacement'
  , layout: 'layout.jade'
  , description: 'Webmin replacement in Node.js<br>Use the menu at the top of the page to continue.'
  , links: links
  })
};

exports.test = function(req, res){
  res.render('index', { 
    title: 'Test'
  , description: 'Lets see Express\'s request object. <hr>' +
      'Req.Url: <pre>' + inspect(req.url) + '</pre>' +
      '<hr>' +
      'Req.Query: <pre>' + inspect(req.query) + '</pre>' +
      '<hr>' +
      'Req.User: <pre>' + inspect(req.user) + '</pre>' +
      '<hr>' +
      'Req.Headers: <pre>' + inspect(req.headers) + '</pre>' +
      '<hr>' +
      'Req.Connection.Pair._SecureEstablished: <pre>' + inspect(req.connection.pair._secureEstablished) + '</pre>' +
      'Req.Connection.Pair.Credentials: <pre>' + inspect(req.connection.pair.credentials) + '</pre>' +
      'Req.Connection.Pair.SSL: <pre>' + inspect(req.connection.pair.ssl) + '</pre>' +
      '<hr>' +
      'Req: <pre>' + inspect(req) + '</pre>' +
      '<hr>' +
      'Res.Locals: <pre>' + inspect(res.locals) + '</pre>' +
      'Res: <pre>' + inspect(res) + '</pre>'
  , links: links
  })
};

exports.utime = function(req, res){
  var os = require('os');
  res.render('utime', { 
    title: 'VPS Uptime'
  , description: 'Testing something'
  , uptime: secondsToString(os.uptime())
  , loadavg: os.loadavg()[0] + ", " + os.loadavg()[1] + ", " + os.loadavg()[2]
  , freemem: os.freemem()/1024
  , links: links
  })
};

exports.cmdexec = function(req, res){
  // Pick up the value from the posted form if available otherwise default to ls
  var cmd = req.body.command || 'ls -la';
  // Reset jade parameters
  setCmdParams();
  // Issue a system command & return values via callback
  jk_cmd(cmd, function(sout, serr) {
      // Override parameter defaults as needed
      cmdParams.title='Output of command: `' + cmd + '`';
      cmdParams.results=sout;
      cmdParams.errors=serr;
      cmdParams.cmd=cmd;
      cmdParams.cmdHint="Enter a shell command";
      //cmdParams.other=inspect(req.headers.authorization.split(" ")[0]);

      // Render the output
      res.render('cmdexec', cmdParams);
  });
}; // ---- End of function cmdexec ----

exports.cmdtop = function(req, res){
  // Pick up the value from the posted form if available otherwise default to ls
  var cmd = 'top -b -n 1';
  setCmdParams();
  jk_cmd(cmd, function(sout, serr) {
      // Override parameter defaults as needed
      cmdParams.title='Top';
      cmdParams.results=sout;
      cmdParams.errors=serr;
      cmdParams.cmd=cmd;
      cmdParams.showform=false; // We don't need the command entry form

      res.render('cmdexec', cmdParams);
  });
};

exports.cmdports = function(req, res){
  // Pick up the value from the posted form if available otherwise default to ls
  var cmd = 'echo "List Open Ports (lsof -i :1025-9999 +c 15): \n" && lsof -i :1025-9999 +c 15 && echo "\n\nNetstat (-lptu --numeric-ports): \n" && netstat -lptu --numeric-ports';
  setCmdParams();
  jk_cmd(cmd, function(sout, serr) {
      // Override parameter defaults as needed
      cmdParams.title='Open Ports';
      cmdParams.results=sout;
      cmdParams.errors=serr;
      cmdParams.cmd=cmd;
      cmdParams.showform=false; // We don't need the command entry form

      res.render('cmdexec', cmdParams);
  });
};

exports.fsedit = function(req, res){
  var fs = require('fs');

  // Pick up the value from the posted form if available otherwise default to ls
  var edFile = req.body.file || 'test.txt';
  
  var out;
  if (req.method == "POST" && req.body.save == "Save") {
    fs.writeFileSync(edFile, req.body.filetext);
    out = req.body.filetext;
    info = 'File written';
  } else {
    out = fs.readFileSync(edFile);    
  }

  res.render('fsedit', {
    title: "Edit File"
  , links: links
  , file: edFile
  , out:  out
  });
};

/*
 * To Do
 *   List log files with links to each (tail)
 *   Editor
 */
