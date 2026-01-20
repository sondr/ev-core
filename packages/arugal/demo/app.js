// Import the Arugal library
// When using the built version, import from the dist folder
import { Arugal } from '/dist/index.mjs';

// Log to console for debugging
console.log('Arugal Demo App Loaded');

// Initialize the main manager with default settings
const manager = Arugal({
    selector: '.arugal-container',
    inline: {
        enabled: true,
        autoplay: false,
        navigation: true,
        pagination: true,
        thumbnails: false
    },
    lightbox: {
        enabled: true,
        keyboard: true,
        closeOnBackdrop: true
    }
});

console.log('Manager initialized:', manager);

// Add keyboard shortcuts info to console
console.log(`
=== Arugal Demo ===
Keyboard shortcuts (when lightbox is open):
- Arrow Left/Right: Navigate between images
- Escape: Close lightbox
- Tab: Navigate focusable elements

Features:
- Click any image to open lightbox
- Use navigation arrows in the inline carousel
`);
