var http = require('http');
var fs = require('fs');

var website = fs.readFileSync('website.html');


//Imports serialport library
var SerialPort = require("serialport");

//
const parsers = SerialPort.parsers;
//Tells node.js how to recieve data coming through serialport
//Recieves data every time it reads a new line
const parser = new parsers.Readline({
    delimeter: '\r\n'
});

//Connects Ardunio to port and establishes parameters
//TODO insert arduino uno address
//side note: there is a simplier way to initalize the port 
//that might be more favorable as it's not as necessary to 
//include the rest of the parameters due to the nature of our project
var port = new SerialPort("COMS5", {
    //Communication speed
    baudRate: 9600,
    //Bits/character
    dataBits: 8,
    //No parity bit used (standard)
    parity: 'none',
    //One bit stop (standard)
    stopBits: 1,
    //Disables software/hardware flow control
    flowControl: false
});

//Attachs port to parser object
port.pipe(parser);


var app = http.createServver(function(req, res) {

    req.WriteHead(200, {'Content-Type' : 'text/html'});
    res.end(website);

});

var io = require('socket.io').listen(app);

io.on('connection', function(data) {

    console.log ("node listening")
});

//Action(s) parser will take once it recieves data (on data event)
parser.on('data', function(data){

    console.log(data);

    io.emit('data', data);

});


app.listen(3000);