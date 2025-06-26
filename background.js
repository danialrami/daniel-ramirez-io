// Enhanced Background Animation using p5.js
// Inspired by LUFS sites: center-emanating particles + floating geometric shapes

let smokeParticles = [];
let floatingShapes = [];
let smokeParticleCount = 80;
let floatingShapeCount = 25;
let centerX, centerY;
let time = 0;
let canvas;
let isFullscreen = false;

// LUFS Color Palette
const colors = {
    teal: [120, 190, 186],
    red: [211, 82, 51],
    yellow: [231, 178, 37],
    blue: [32, 105, 175],
    black: [17, 17, 17],
    white: [251, 249, 226]
};

const colorKeys = ['teal', 'blue', 'yellow', 'red', 'white'];

function setup() {
    // Create canvas and attach to background container
    let container = document.getElementById('background-container');
    let containerRect = container.getBoundingClientRect();
    
    canvas = createCanvas(containerRect.width, containerRect.height);
    canvas.parent('background-container');
    
    // FIXED: Adjust center position to be higher up, away from profile picture area
    centerX = width / 2;
    centerY = height * 0.3; // Move center higher up
    
    // Initialize smoke particles (center-emanating)
    for (let i = 0; i < smokeParticleCount; i++) {
        smokeParticles.push(new SmokeParticle());
    }
    
    // Initialize floating shapes (scattered throughout)
    for (let i = 0; i < floatingShapeCount; i++) {
        floatingShapes.push(new FloatingShape());
    }
    
    // Listen for fullscreen toggle
    document.addEventListener('fullscreenToggle', handleFullscreenToggle);
}

function draw() {
    // Dark background
    background(colors.black[0], colors.black[1], colors.black[2]);
    
    time += 0.008;
    
    // Update center position with subtle movement
    centerX = width / 2 + sin(time * 0.5) * 15;
    centerY = height * 0.3 + cos(time * 0.3) * 10; // Keep higher up
    
    // Draw floating shapes first (background layer)
    for (let i = floatingShapes.length - 1; i >= 0; i--) {
        floatingShapes[i].update();
        floatingShapes[i].display();
        
        if (floatingShapes[i].isDead()) {
            floatingShapes.splice(i, 1);
            floatingShapes.push(new FloatingShape());
        }
    }
    
    // Draw smoke particles (foreground layer)
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
        smokeParticles[i].update();
        smokeParticles[i].display();
        
        if (smokeParticles[i].isDead()) {
            smokeParticles.splice(i, 1);
            smokeParticles.push(new SmokeParticle());
        }
    }
    
    // Add subtle center glow (but keep it away from profile area)
    drawCenterGlow();
}

function drawCenterGlow() {
    push();
    drawingContext.globalCompositeOperation = 'screen';
    
    // Create subtle radial gradient effect
    for (let r = 80; r > 0; r -= 6) {
        let alpha = map(r, 0, 80, 0.03, 0);
        let colorIndex = floor(time * 1.5) % colorKeys.length;
        let currentColor = colors[colorKeys[colorIndex]];
        
        fill(currentColor[0], currentColor[1], currentColor[2], alpha * 255);
        noStroke();
        ellipse(centerX, centerY, r);
    }
    
    pop();
}

// Smoke Particle Class (center-emanating)
class SmokeParticle {
    constructor() {
        this.reset();
    }
    
    reset() {
        // Start from center with slight randomness
        this.x = centerX + random(-15, 15);
        this.y = centerY + random(-15, 15);
        
        // Random direction and speed
        let angle = random(TWO_PI);
        let speed = random(0.3, 1.5);
        this.vx = cos(angle) * speed;
        this.vy = sin(angle) * speed;
        
        // Particle properties
        this.life = 1.0;
        this.maxLife = random(180, 320);
        this.size = random(1, 4);
        this.maxSize = this.size * random(2, 4);
        
        // Color selection
        this.colorKey = random(colorKeys);
        this.color = colors[this.colorKey];
        
        // Noise offset for organic movement
        this.noiseOffsetX = random(1000);
        this.noiseOffsetY = random(1000);
        
        this.age = 0;
    }
    
    update() {
        this.age++;
        
        // Organic movement using noise
        let noiseScale = 0.008;
        let noiseStrength = 0.3;
        
        this.vx += (noise(this.noiseOffsetX + this.age * noiseScale) - 0.5) * noiseStrength;
        this.vy += (noise(this.noiseOffsetY + this.age * noiseScale) - 0.5) * noiseStrength;
        
        // Apply slight upward drift
        this.vy -= 0.015;
        
        // Damping
        this.vx *= 0.995;
        this.vy *= 0.995;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Update life and size
        this.life = 1 - (this.age / this.maxLife);
        this.size = lerp(this.size, this.maxSize, 0.015);
        
        // Fade out as particle ages
        if (this.life < 0.3) {
            this.size *= 0.985;
        }
    }
    
    display() {
        if (this.life <= 0) return;
        
        push();
        drawingContext.globalCompositeOperation = 'screen';
        
        // Calculate alpha based on life and distance from center
        let distFromCenter = dist(this.x, this.y, centerX, centerY);
        let distanceAlpha = map(distFromCenter, 0, 200, 1, 0.2);
        distanceAlpha = constrain(distanceAlpha, 0, 1);
        
        let alpha = this.life * distanceAlpha * 0.4;
        
        // Draw particle with glow effect
        for (let r = this.size; r > 0; r -= 0.5) {
            let glowAlpha = map(r, 0, this.size, alpha, alpha * 0.1);
            fill(this.color[0], this.color[1], this.color[2], glowAlpha * 255);
            noStroke();
            ellipse(this.x, this.y, r);
        }
        
        pop();
    }
    
    isDead() {
        return this.life <= 0 || this.age > this.maxLife;
    }
}

// Floating Shape Class (scattered throughout)
class FloatingShape {
    constructor() {
        this.reset();
    }
    
    reset() {
        // Random position anywhere on canvas
        this.x = random(width);
        this.y = random(height);
        
        // Slow, gentle movement
        this.vx = random(-0.5, 0.5);
        this.vy = random(-0.5, 0.5);
        
        // Shape properties
        this.size = random(8, 25);
        this.rotation = random(TWO_PI);
        this.rotationSpeed = random(-0.01, 0.01);
        
        // Color and opacity
        this.colorKey = random(colorKeys);
        this.color = colors[this.colorKey];
        this.baseAlpha = random(0.1, 0.3);
        this.alpha = this.baseAlpha;
        
        // Shape type
        this.shapeType = random(['circle', 'square', 'triangle']);
        
        // Life properties
        this.life = 1.0;
        this.maxLife = random(600, 1200);
        this.age = 0;
        
        // Floating behavior
        this.floatOffset = random(1000);
        this.floatAmplitude = random(0.5, 2);
    }
    
    update() {
        this.age++;
        
        // Gentle floating movement
        this.x += this.vx;
        this.y += this.vy + sin(this.age * 0.01 + this.floatOffset) * this.floatAmplitude * 0.1;
        
        // Rotation
        this.rotation += this.rotationSpeed;
        
        // Wrap around edges
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
        
        // Subtle alpha pulsing
        this.alpha = this.baseAlpha + sin(this.age * 0.02) * 0.1;
        
        // Life calculation
        this.life = 1 - (this.age / this.maxLife);
    }
    
    display() {
        if (this.life <= 0) return;
        
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        
        fill(this.color[0], this.color[1], this.color[2], this.alpha * this.life * 255);
        noStroke();
        
        // Draw different shapes
        switch(this.shapeType) {
            case 'circle':
                ellipse(0, 0, this.size);
                break;
            case 'square':
                rectMode(CENTER);
                rect(0, 0, this.size, this.size);
                break;
            case 'triangle':
                let h = this.size * 0.866; // height of equilateral triangle
                triangle(0, -h/2, -this.size/2, h/2, this.size/2, h/2);
                break;
        }
        
        pop();
    }
    
    isDead() {
        return this.life <= 0 || this.age > this.maxLife;
    }
}

function handleFullscreenToggle() {
    isFullscreen = !isFullscreen;
    
    setTimeout(() => {
        let container = document.getElementById('background-container');
        let containerRect = container.getBoundingClientRect();
        resizeCanvas(containerRect.width, containerRect.height);
        
        // FIXED: Adjust center position based on fullscreen state
        centerX = width / 2;
        if (isFullscreen) {
            centerY = height * 0.4; // Center more in fullscreen
        } else {
            centerY = height * 0.3; // Higher up in banner mode
        }
    }, 100);
}

function windowResized() {
    if (!isFullscreen) {
        let container = document.getElementById('background-container');
        let containerRect = container.getBoundingClientRect();
        resizeCanvas(containerRect.width, containerRect.height);
        centerX = width / 2;
        centerY = height * 0.3; // Keep higher up in banner mode
    }
}

// Prevent right-click context menu on canvas
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'CANVAS') {
        e.preventDefault();
    }
});

