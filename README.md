# Daniel Ramirez Linktree Site

Featuring enhanced generative background animation, modular dropdown sections, and responsive design

## 🎨 Design Elements

### Background Animation System
- **Dual Particle Systems**: Center-emanating smoke particles + scattered floating shapes
- **LUFS Color Integration**: All animations use the official LUFS color palette
- **Proper Layering**: Background stays behind profile content
- **Organic Movement**: Noise-based particle movement for natural feel

### Interactive Elements
- **Banner-Style Background**: Contained in hero section by default
- **Modular Carousels**: LUFS and danialrami sections with horizontal scrolling
- **Scrolling Top Animation**: Continuous gradient animation inspired by LUFS sites
- **Bottom Gliders**

### Visuals
- **Enhanced Typography**: Host Grotesk for titles, Public Sans for body text
- **Responsive Design**: Optimized for all devices with touch support

## 🎯 Animation Details

### Scrolling Top Animation
- Continuous LUFS color gradient moving left to right
- Inspired by echobridge.lufs.audio design
- 4px height bar at top of viewport
- 8-second animation cycle

### Cellular Automata Gliders
- Conway's Game of Life inspired patterns
- Travel from left to right across bottom edge
- LUFS gradient colors with trail effects
- Spawn every 8 seconds with fade-out at edges

### Background Particles
- **Smoke Particles**: 80 center-emanating particles with organic movement
- **Floating Shapes**: 25 geometric shapes (circles, squares, triangles)
- **Color Cycling**: Automatic rotation through LUFS color palette
- **Proper Layering**: Background stays behind profile content

## 🚀 Performance Features

- **Efficient Particle Systems**: Object pooling and lifecycle management
- **Smooth Animations**: Hardware-accelerated CSS transforms
- **Image Preloading**: Faster initial load times
- **Debounced Resize Handlers**: Optimized window resize performance
- **Minimal Dependencies**: Only p5.js for background animation

## ⌨️ Keyboard Shortcuts

- **Alt + C**: Close all open dropdowns
- **Escape**: Close all open dropdowns
- **Tab/Shift+Tab**: Navigate through interactive elements

## 📱 Responsive Design

- **Desktop**: Full banner experience with hover effects
- **Tablet**: Optimized touch interactions and carousel scrolling
- **Mobile**: Compact layout with touch-friendly controls