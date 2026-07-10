#updated code
const http = require('http');
const fs = require('fs');
const SerialPort = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const socketIo = require('socket.io');

// read the HTML file to serve
const website = fs.readFileSync('website.html');

// create HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(website);
});

// attach Socket.IO to the server
const io = socketIo(server);

// Serial Port setup 
const port = new SerialPort('COMS5', {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

// reate a parser that reads data line-by-line
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// When a new client connects to the website
io.on('connection', (socket) => {
    console.log('A user connected');
});

// When data comes from Arduino
parser.on('data', (data) => {
    console.log('Received from Arduino:', data);

    const temperature = parseFloat(data);

    let mood = 'Unknown';

    if (!isNaN(temperature)) {
        if (temperature < 20) {
            mood = 'You seem calm and cooooool.';
        } else if (temperature >= 20 && temperature <= 25) {
            mood = 'You are in a balanced and relaxed state!';
        } else if (temperature > 25 && temperature <= 30) {
            mood = 'You might be getting a bit warm—STAY HYDRATED!';
        } else {
            mood = 'You seem stressed or overheated. Take a break!';
        }
    }

    // Send both temperature and mood to the client
    io.emit('data', { temperature, mood });
});

// Start server on port 3000
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
