// Bottom Animation: Cellular Automata Gliders
// Inspired by Conway's Game of Life gliders with LUFS color gradients

class GliderAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gliders = [];
        this.maxGliders = 3;
        this.lastSpawn = 0;
        this.spawnInterval = 8000; // 8 seconds between gliders
        
        // LUFS colors
        this.colors = [
            '#78BEBA', // teal
            '#2069af', // blue
            '#E7B225', // yellow
            '#D35233', // red
        ];
        
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas properties
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        // Append to bottom animation container
        const container = document.getElementById('bottom-animation');
        container.appendChild(this.canvas);
        
        this.resize();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const container = document.getElementById('bottom-animation');
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    }
    
    createGlider() {
        const glider = {
            x: -50, // Start off-screen left
            y: Math.random() * (this.canvas.height - 20) + 10,
            speed: 0.5 + Math.random() * 0.5,
            cellSize: 3 + Math.random() * 2,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            trail: [],
            maxTrailLength: 15,
            pattern: [
                [0, 1, 0],
                [0, 0, 1],
                [1, 1, 1]
            ],
            phase: 0,
            opacity: 1
        };
        
        return glider;
    }
    
    updateGlider(glider) {
        // Move glider
        glider.x += glider.speed;
        
        // Add to trail
        glider.trail.push({ x: glider.x, y: glider.y, opacity: glider.opacity });
        if (glider.trail.length > glider.maxTrailLength) {
            glider.trail.shift();
        }
        
        // Update phase for animation
        glider.phase += 0.02;
        
        // Fade out when near the right edge
        if (glider.x > this.canvas.width - 100) {
            glider.opacity = Math.max(0, (this.canvas.width - glider.x) / 100);
        }
        
        // Remove if completely off-screen
        return glider.x < this.canvas.width + 50;
    }
    
    drawGlider(glider) {
        this.ctx.save();
        
        // Draw trail
        glider.trail.forEach((point, index) => {
            const trailOpacity = (index / glider.trail.length) * point.opacity * 0.3;
            this.ctx.globalAlpha = trailOpacity;
            this.ctx.fillStyle = glider.color;
            
            // Draw smaller trail cells
            this.ctx.fillRect(
                point.x - glider.cellSize * 0.5,
                point.y - glider.cellSize * 0.5,
                glider.cellSize,
                glider.cellSize
            );
        });
        
        // Draw main glider pattern
        this.ctx.globalAlpha = glider.opacity;
        this.ctx.fillStyle = glider.color;
        
        // Add subtle glow effect
        this.ctx.shadowColor = glider.color;
        this.ctx.shadowBlur = 8;
        
        // Draw the glider pattern with slight animation
        for (let row = 0; row < glider.pattern.length; row++) {
            for (let col = 0; col < glider.pattern[row].length; col++) {
                if (glider.pattern[row][col] === 1) {
                    const cellX = glider.x + col * glider.cellSize;
                    const cellY = glider.y + row * glider.cellSize;
                    
                    // Add slight pulsing animation
                    const pulse = 1 + Math.sin(glider.phase + row + col) * 0.1;
                    const size = glider.cellSize * pulse;
                    
                    this.ctx.fillRect(
                        cellX - size / 2,
                        cellY - size / 2,
                        size,
                        size
                    );
                }
            }
        }
        
        this.ctx.restore();
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const now = Date.now();
        
        // Spawn new glider if needed
        if (this.gliders.length < this.maxGliders && now - this.lastSpawn > this.spawnInterval) {
            this.gliders.push(this.createGlider());
            this.lastSpawn = now;
        }
        
        // Update and draw gliders
        this.gliders = this.gliders.filter(glider => {
            const shouldKeep = this.updateGlider(glider);
            if (shouldKeep) {
                this.drawGlider(glider);
            }
            return shouldKeep;
        });
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GliderAnimation();
});

