// Main JavaScript for daniel-ramirez.io v3 - Restyled

document.addEventListener('DOMContentLoaded', function() {
    initializeDropdowns();
    setCurrentYear();
    preloadImages();
});

// Dropdown functionality
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
                this.classList.remove('active');
                dropdown.classList.remove('active');
            } else {
                this.classList.add('active');
                dropdown.classList.add('active');
            }
        });
    });
}

// Close all dropdowns
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
        'https://danialrami.com/images/front-idle.gif'
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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.altKey && e.key === 'c') || e.key === 'Escape') {
        e.preventDefault();
        closeAllDropdowns();
    }
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