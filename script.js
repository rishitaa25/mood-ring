document.addEventListener('DOMContentLoaded', function() {
    // Connects to the Socket.IO server
    const socket = io();

    // When data is received from the server
    socket.on('data', function(value) {
        console.log('Received from server:', value);

        // Updates display text
        document.getElementById('input').textContent = value + " C";

        // Gets ring element
        const ring = document.querySelector('.ring');
        console.log('Ring element:', ring); // Verify that this is not null

        if (!ring) {
            console.error('Ring element not found!');
            return;
        }

        const num = parseFloat(value);
        console.log('Parsed value:', num);
        
        // Checks if num is a valid number
        if (isNaN(num)) {
            console.error('Invalid number received:', value);
            return;  // Stops if the value is not a valid number
        }

        // Decides glow color and mood based on value (same as Ardunio to match)
        let color, mood;
        if (num < 22.75) {
            color = 'rgba(0, 255, 255, 0.5)'; // Cyan
            mood = 'Sad';
        } else if (num < 23.50) {
            color = 'rgba(0, 255, 0, 0.5)';   // Green
            mood = 'Chill';
        } else if (num < 24.50) {
            color = 'rgba(255, 255, 0, 0.5)'; // Yellow
            mood = 'Happy';
        } else {
            color = 'rgba(255, 0, 0, 0.5)';   // Red
            mood = 'Stressed';
        }

    
        // Updates mood display
        document.getElementById('mood-display').textContent = `Mood: ${mood}`;

        // Updates the --glow-color CSS variable (dynamically)
        ring.style.setProperty('--glow-color', color);

        // Applys a smooth transition to box-shadow
        ring.style.transition = 'box-shadow 1s ease';

        // Pulse effect: alternate between large and small glow
        let pulseState = true;  // Toggle between large and small
        let pulseGlow = setInterval(() => {
            if (pulseState) {
                ring.style.boxShadow = `0 0 30px 20px ${color}, 0 0 100px 30px ${color}`;
            } else {
                ring.style.boxShadow = `0 0 20px 10px ${color}, 0 0 50px 15px ${color}`;
            }

            pulseState = !pulseState;  // Toggle pulse state
        }, 500); 

        // Clear interval when it's no longer needed
        socket.on('data', function() {
            clearInterval(pulseGlow);  // Stop previous pulse glow
        });
    });
});