// Main JavaScript for daniel-ramirez.io v3
// FIXED: Remove auto-collapse behavior and fix fullscreen toggle

document.addEventListener('DOMContentLoaded', function() {
    initializeDropdowns();
    initializeFullscreenToggle();
    initializeKeyboardShortcuts();
    preloadImages();
    setCurrentYear();
});

// FIXED: Dropdown functionality - only close when specifically clicked
function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const sectionName = this.getAttribute('data-section');
            const dropdown = document.getElementById(`${sectionName}-dropdown`);
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                // Close this dropdown
                this.classList.remove('active');
                dropdown.classList.remove('active');
            } else {
                // Open this dropdown
                this.classList.add('active');
                dropdown.classList.add('active');
            }
        });
    });
    
    // REMOVED: Auto-collapse behavior when clicking outside
    // Dropdowns now only close when specifically clicked
}

// FIXED: Fullscreen toggle with smooth animation
function initializeFullscreenToggle() {
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    const body = document.body;
    let isFullscreen = false;
    
    fullscreenToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isFullscreen = !isFullscreen;
        
        if (isFullscreen) {
            // Enter fullscreen mode
            body.classList.add('fullscreen-bg');
            this.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
            `;
            this.setAttribute('aria-label', 'Exit fullscreen background');
        } else {
            // Exit fullscreen mode
            body.classList.remove('fullscreen-bg');
            this.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
            `;
            this.setAttribute('aria-label', 'Toggle fullscreen background');
        }
        
        // Dispatch custom event for background animation
        document.dispatchEvent(new CustomEvent('fullscreenToggle', {
            detail: { isFullscreen }
        }));
    });
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Alt + F: Toggle fullscreen
        if (e.altKey && e.key === 'f') {
            e.preventDefault();
            document.getElementById('fullscreen-toggle').click();
        }
        
        // Alt + C or Escape: Close all dropdowns
        if ((e.altKey && e.key === 'c') || e.key === 'Escape') {
            e.preventDefault();
            closeAllDropdowns();
        }
    });
}

// Close all dropdowns function
function closeAllDropdowns() {
    const activeToggles = document.querySelectorAll('.dropdown-toggle.active');
    const activeDropdowns = document.querySelectorAll('.dropdown-content.active');
    
    activeToggles.forEach(toggle => toggle.classList.remove('active'));
    activeDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
}

// Preload images for better performance
function preloadImages() {
    const imageSources = [
        'cloud-profile.png',
        'portfolio-favicon.svg',
        'echobridge-favicon.svg',
        'albumdujour-favicon.svg',
        'deck-favicon.svg',
        'resume-favicon.svg',
        'time-favicon.svg'
    ];
    
    imageSources.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Smooth scrolling for any internal links (if added in future)
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Analytics tracking for external links
function trackLinkClick(linkText, url) {
    // Placeholder for analytics tracking
    console.log(`Link clicked: ${linkText} -> ${url}`);
    
    // Example: Google Analytics event tracking
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'click', {
    //         event_category: 'external_link',
    //         event_label: linkText,
    //         value: url
    //     });
    // }
}

// Add click tracking to all external links
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const linkText = this.textContent.trim();
            const url = this.href;
            trackLinkClick(linkText, url);
        });
    });
});

// Performance optimization: Debounced resize handler
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Trigger any resize-dependent functionality
        document.dispatchEvent(new CustomEvent('optimizedResize'));
    }, 250);
});

// Accessibility: Focus management for dropdowns
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        const activeDropdown = document.querySelector('.dropdown-content.active');
        if (activeDropdown) {
            const focusableElements = activeDropdown.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// Touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartY - touchEndY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe up - could trigger some action in future
        } else {
            // Swipe down - could trigger some action in future
        }
    }
}

// Intersection Observer for animations (if needed in future)
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Error handling for missing elements
function handleMissingElements() {
    const requiredElements = [
        'fullscreen-toggle',
        'background-container',
        'bottom-animation'
    ];
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Required element with id '${id}' not found`);
        }
    });
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', handleMissingElements);

