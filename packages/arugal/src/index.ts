import { ArugalOptions, CarGalOptions, MediaItemInput } from './core/types';
import { Manager } from './core/manager';
import { GalleryInstance } from './core/instance';
import { isLightboxOpen } from './core/lightbox';

/**
 * Initializes the Arugal gallery manager and automatically scans the DOM for galleries.
 * 
 * @param options - Configuration options for all galleries
 * @returns Manager instance with methods to control galleries
 * 
 * @example
 * ```typescript
 * // Basic initialization with defaults
 * const manager = Arugal();
 * 
 * // With custom options
 * const manager = Arugal({
 *   selector: '.my-gallery',
 *   theme: {
 *     primaryColor: '#ff0000'
 *   },
 *   inline: {
 *     autoplay: { interval: 3000 }
 *   }
 * });
 * ```
 */
export function Arugal(options?: ArugalOptions): Manager {
    return new Manager(options);
}

/**
 * Creates a single gallery instance on a specific element without automatic DOM scanning.
 * Useful for dynamically added content or when you need more control.
 * 
 * @param element - The HTML element to initialize as a gallery
 * @param options - Configuration options for this gallery
 * @returns Gallery instance or null if initialization fails
 * 
 * @example
 * ```typescript
 * const galleryEl = document.querySelector('#my-gallery');
 * const gallery = create(galleryEl, {
 *   inline: { autoplay: false }
 * });
 * ```
 */
export function create(element: HTMLElement, options?: ArugalOptions): GalleryInstance | null {
    if (!element) {
        console.error('[Arugal] create: Invalid element provided');
        return null;
    }
    
    const manager = new Manager({ ...options, selector: undefined });
    return manager.create(element);
}

// Export types for TypeScript users
export type { ArugalOptions, CarGalOptions, MediaItemInput, GalleryInstance };

// Export Manager class for advanced users
export { Manager };

// Export utility to check if lightbox is open (useful when multiple instances exist)
export { isLightboxOpen };
