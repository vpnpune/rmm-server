// Firstly we'll need to import the fs library
let fs = require('fs');

// next we'll want make our Logger object available
// to whatever file references it.
let Logger = exports.Logger = {};


// Create 3 sets of write streams for the 3 levels of logging we wish to do
// every time we get an error we'll append to our error streams, any debug message
// to our debug stream etc...
let infoStream = fs.createWriteStream('logs/info.txt', {flags: 'a'});
// Notice we set the path of our log files in the first parameter of 
// fs.createWriteStream. This could easily be pulled in from a config
// file if needed.
let errorStream = fs.createWriteStream('logs/error.txt', {flags: 'a'});
// createWriteStream takes in options as a second, optional parameter
// if you wanted to set the file encoding of your output file you could
// do so by setting it like so: ('logs/debug.txt' , { encoding : 'utf-8' });
let debugStream = fs.createWriteStream('logs/debug.txt', {flags: 'a'});


// Finally we create 3 different functions
// each of which appends our given messages to 
// their own log files along with the current date as an
// iso string and a \n newline character
Logger.info = function(msg) {
    let fileAndLine = traceCaller(1);
    let message = new Date().toISOString() + " : "+fileAndLine+" : " + msg + "\n";
    infoStream.write(message);
};

Logger.debug = function(msg) {
    let fileAndLine = traceCaller(1);
    let message = new Date().toISOString() + " : "+fileAndLine+" : " + msg + "\n";
    debugStream.write(message);
};

Logger.error = function(msg) {
    let fileAndLine = traceCaller(1);
    let message = new Date().toISOString() + " : "+fileAndLine+" : " + msg + "\n";
    errorStream.write(message);
};

/**
  * examines the call stack and returns a string indicating 
  * the file and line number of the n'th previous ancestor call.
  * this works in chrome, and should work in nodejs as well.  
  *
  * @param n : int (default: n=1) - the number of calls to trace up the
  *   stack from the current call.  `n=0` gives you your current file/line.
  *  `n=1` gives the file/line that called you.
  */
 function traceCaller(n) {
    if( isNaN(n) || n<0) n=1;
    n+=1;
    let s = (new Error()).stack
      , a=s.indexOf('\n',5);
    while(n--) {
      a=s.indexOf('\n',a+1);
      if( a<0 ) { a=s.lastIndexOf('\n',s.length); break;}
    }
    let b=s.indexOf('\n',a+1); if( b<0 ) b=s.length;
    a=Math.max(s.lastIndexOf(' ',b), s.lastIndexOf('/',b));
    b=s.lastIndexOf(':',b);
    s=s.substring(a+1,b);
    return s;
  }