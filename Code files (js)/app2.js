/** Server that serves an HTML page and streams Arduino serial data to clients via WebSocket **/
//Kill server-> netstat -ano | findstr :5000

const http = require('http');
const fs = require('fs');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { Server } = require('socket.io');

// Loads HTML and JS files
const html = fs.readFileSync('website2.html'); // Your main HTML page
const script = fs.readFileSync('script.js');  // The frontend JavaScript

// Sets up the serial port connection
const port = new SerialPort({
    path: 'COM5', 
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

// Sets up the parser to read data line by line
const parser = new ReadlineParser({ delimiter: '\r\n' });
port.pipe(parser);

// Creates HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/script.js') {
        // Serves the frontend JS file
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(script);
    } else {
        // Serves the main HTML page
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }
});

// Attachs Socket.IO to the HTTP server
const io = new Server(server);

// Handles new WebSocket connections
io.on('connection', (socket) => {
    console.log('Client connected');
});

// Streams serial data to WebSocket clients
parser.on('data', (data) => {
    const parsed = parseFloat(data);
    if (!isNaN(parsed)) {
        console.log('Serial Data:', parsed);
        io.emit('data', parsed); // Emit as number
    }
});

// Starts the server
server.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});
