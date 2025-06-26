// Foreground Animation: Cellular Automata Glider with LUFS Gradient
// Subtle animation that travels across the bottom of the screen

let foregroundCanvas;
let gliders = [];
let time = 0;

// LUFS Colors for gradient
const lufsColors = [
    [120, 190, 186], // teal
    [32, 105, 175],  // blue
    [231, 178, 37],  // yellow
    [211, 82, 51],   // red
];

function initializeForegroundAnimation() {
    // Create canvas for foreground animation
    foregroundCanvas = document.createElement('canvas');
    foregroundCanvas.style.position = 'absolute';
    foregroundCanvas.style.top = '0';
    foregroundCanvas.style.left = '0';
    foregroundCanvas.style.width = '100%';
    foregroundCanvas.style.height = '100%';
    foregroundCanvas.style.pointerEvents = 'none';
    
    document.getElementById('foreground-animation').appendChild(foregroundCanvas);
    
    // Set canvas size
    resizeForegroundCanvas();
    
    // Initialize gliders
    createGlider();
    
    // Start animation loop
    animateForeground();
    
    // Handle window resize
    window.addEventListener('resize', resizeForegroundCanvas);
}

function resizeForegroundCanvas() {
    const container = document.getElementById('foreground-animation');
    const rect = container.getBoundingClientRect();
    
    foregroundCanvas.width = rect.width;
    foregroundCanvas.height = rect.height;
}

function createGlider() {
    gliders.push(new CellularGlider());
}

function animateForeground() {
    const ctx = foregroundCanvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);
    
    time += 0.01;
    
    // Update and draw gliders
    for (let i = gliders.length - 1; i >= 0; i--) {
        gliders[i].update();
        gliders[i].display(ctx);
        
        // Remove completed gliders and create new ones
        if (gliders[i].isComplete()) {
            gliders.splice(i, 1);
            // Create new glider after a delay
            if (Math.random() < 0.003) { // Low probability for subtle effect
                createGlider();
            }
        }
    }
    
    // Ensure we always have at least one glider eventually
    if (gliders.length === 0 && Math.random() < 0.01) {
        createGlider();
    }
    
    requestAnimationFrame(animateForeground);
}

class CellularGlider {
    constructor() {
        this.reset();
    }
    
    reset() {
        // Start from left side, random Y position in bottom area
        this.x = -50;
        this.y = foregroundCanvas.height - 40 + Math.random() * 20;
        
        // Movement properties
        this.speed = 0.5 + Math.random() * 0.5;
        this.direction = 1; // 1 for left-to-right, -1 for right-to-left
        
        if (Math.random() < 0.3) {
            // Sometimes start from right
            this.x = foregroundCanvas.width + 50;
            this.direction = -1;
        }
        
        // Glider pattern (classic Conway's Game of Life glider)
        this.pattern = [
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1]
        ];
        
        // Visual properties
        this.cellSize = 3 + Math.random() * 2;
        this.opacity = 0.6 + Math.random() * 0.4;
        this.colorPhase = Math.random() * Math.PI * 2;
        
        // Animation properties
        this.age = 0;
        this.maxAge = foregroundCanvas.width / this.speed + 100;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }
    
    update() {
        this.age++;
        this.x += this.speed * this.direction;
        
        // Subtle vertical floating
        this.y += Math.sin(this.age * 0.02 + this.pulsePhase) * 0.1;
        
        // Update color phase for gradient effect
        this.colorPhase += 0.02;
    }
    
    display(ctx) {
        ctx.save();
        
        // Calculate current color from gradient
        let colorIndex = (this.colorPhase + this.x * 0.01) % (lufsColors.length * Math.PI * 2);
        let normalizedIndex = (colorIndex / (Math.PI * 2)) % lufsColors.length;
        
        let color1Index = Math.floor(normalizedIndex);
        let color2Index = (color1Index + 1) % lufsColors.length;
        let blend = normalizedIndex - color1Index;
        
        let color1 = lufsColors[color1Index];
        let color2 = lufsColors[color2Index];
        
        let r = Math.round(color1[0] * (1 - blend) + color2[0] * blend);
        let g = Math.round(color1[1] * (1 - blend) + color2[1] * blend);
        let b = Math.round(color1[2] * (1 - blend) + color2[2] * blend);
        
        // Calculate fade based on position
        let fadeAlpha = 1;
        if (this.direction === 1) {
            // Fade in from left
            if (this.x < 50) fadeAlpha = this.x / 50;
            // Fade out to right
            if (this.x > foregroundCanvas.width - 50) {
                fadeAlpha = (foregroundCanvas.width - this.x) / 50;
            }
        } else {
            // Fade in from right
            if (this.x > foregroundCanvas.width - 50) {
                fadeAlpha = (foregroundCanvas.width - this.x) / 50;
            }
            // Fade out to left
            if (this.x < 50) fadeAlpha = this.x / 50;
        }
        
        fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));
        
        // Pulse effect
        let pulseAlpha = 0.7 + 0.3 * Math.sin(this.age * 0.1 + this.pulsePhase);
        
        let finalAlpha = this.opacity * fadeAlpha * pulseAlpha;
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
        
        // Draw the glider pattern
        for (let row = 0; row < this.pattern.length; row++) {
            for (let col = 0; col < this.pattern[row].length; col++) {
                if (this.pattern[row][col] === 1) {
                    let cellX = this.x + col * this.cellSize * 1.5;
                    let cellY = this.y + row * this.cellSize * 1.5;
                    
                    // Draw cell with slight glow
                    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.5})`;
                    ctx.shadowBlur = this.cellSize;
                    
                    ctx.fillRect(
                        cellX - this.cellSize / 2,
                        cellY - this.cellSize / 2,
                        this.cellSize,
                        this.cellSize
                    );
                }
            }
        }
        
        ctx.restore();
    }
    
    isComplete() {
        if (this.direction === 1) {
            return this.x > foregroundCanvas.width + 50;
        } else {
            return this.x < -50;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure other elements are ready
    setTimeout(initializeForegroundAnimation, 500);
});

