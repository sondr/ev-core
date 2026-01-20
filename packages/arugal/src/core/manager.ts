import { ArugalOptions, DefaultLightboxOptions, LightboxOptions, DefaultInlineOptions, InlineOptions } from './types';
import { GalleryInstance } from './instance';
import { Lightbox, getSharedLightbox, releaseSharedLightbox } from './lightbox';
import { EventManager } from '../dom/events';
import { deepMerge } from '../utils/merge';
import { DynamicStylesheet } from '../dom/stylesheets';
import { DefaultTheme } from './types';
import { CSS_CLASSES } from '../utils/constants';

/**
 * Main manager class that orchestrates all gallery instances.
 * Handles initialization, lifecycle, and shared resources like lightbox and event management.
 */
export class Manager {
    private instances: GalleryInstance[] = [];
    private instanceMap: WeakMap<HTMLElement, GalleryInstance> = new WeakMap();
    private options: ArugalOptions;
    private lightbox: Lightbox;
    private eventManager: EventManager;
    private stylesheet: DynamicStylesheet;

    /**
     * Creates a new Manager instance
     * @param options - Global configuration options
     */
    constructor(options: ArugalOptions = {}) {
        this.options = options;
        this.eventManager = new EventManager();
        this.stylesheet = new DynamicStylesheet();

        // Get shared lightbox instance (ensures only one lightbox across all managers)
        const lbOpts = deepMerge({}, DefaultLightboxOptions, options.lightbox || {}) as LightboxOptions;
        this.lightbox = getSharedLightbox(lbOpts, this.eventManager);

        // Apply Theme
        const theme = deepMerge({}, DefaultTheme, options.theme || {});
        this.applyTheme(theme);

        const selector = this.options.selector || `.${CSS_CLASSES.CONTAINER}`;
        this.scan(selector);
        
        // Trigger global init callback
        if (this.options.on?.init) {
            this.options.on.init(this);
        }
    }

    /**
     * Applies theme CSS variables and styles
     * @private
     */
    private applyTheme(theme: any) {
        const inlineOpts = deepMerge({}, DefaultInlineOptions, this.options.inline || {}) as InlineOptions;
        const lightboxOpts = deepMerge({}, DefaultLightboxOptions, this.options.lightbox || {}) as LightboxOptions;
        
        const css = `
            :root {
                --arugal-primary: ${theme.primaryColor};
                --arugal-bg: ${theme.backgroundColor};
                --arugal-text: ${theme.textColor};
            }
            
            /* Container Base Styles */
            .${CSS_CLASSES.CONTAINER} {
                position: relative;
                overflow: hidden;
            }
            
            .${CSS_CLASSES.ITEM} {
                cursor: pointer;
                transition: transform 0.3s ease, opacity 0.3s ease;
                user-select: none;
            }
            
            .${CSS_CLASSES.ITEM} img {
                max-width: 100%;
                height: auto;
                display: block;
            }
            
            ${inlineOpts.zoomOnHover ? `
            .${CSS_CLASSES.ITEM}:hover {
                transform: scale(1.05);
            }
            ` : ''}
            
            /* Lightbox Overlay */
            .${CSS_CLASSES.OVERLAY} {
                position: fixed !important;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                display: none !important;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .${CSS_CLASSES.OVERLAY}.${CSS_CLASSES.ACTIVE} {
                display: flex !important;
            }
            
            /* Lightbox Content */
            .${CSS_CLASSES.LIGHTBOX_CONTENT} {
                max-width: 90%;
                max-height: 90%;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
            }
            
            .${CSS_CLASSES.LIGHTBOX_CONTENT} img {
                max-width: 100%;
                max-height: 85vh;
                object-fit: contain;
                display: block;
                transition: transform 0.3s ease;
            }
            
            ${lightboxOpts.zoomOnHover ? `
            .${CSS_CLASSES.LIGHTBOX_CONTENT} img:hover {
                transform: scale(1.05);
            }
            ` : ''}
            
            .${CSS_CLASSES.CAPTION} {
                color: white;
                text-align: center;
                padding: 1rem;
                font-size: 1.1rem;
                background: rgba(0, 0, 0, 0.7);
                width: 100%;
            }
            
            /* Navigation Buttons */
            .${CSS_CLASSES.NAV_BTN} {
                position: fixed;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.9);
                border: none;
                padding: 1rem 1.5rem;
                font-size: 2rem;
                cursor: pointer;
                z-index: 10000;
                border-radius: 4px;
                transition: background 0.3s ease;
                color: #333;
                font-weight: bold;
            }
            
            .${CSS_CLASSES.NAV_BTN}:hover {
                background: rgba(255, 255, 255, 1);
            }
            
            .${CSS_CLASSES.NAV_BTN}.${CSS_CLASSES.PREV} {
                left: 20px;
            }
            
            .${CSS_CLASSES.NAV_BTN}.${CSS_CLASSES.NEXT} {
                right: 20px;
            }
            
            /* Carousel Controls */
            .${CSS_CLASSES.CONTROLS} {
                display: flex;
                justify-content: space-between;
                padding: 1rem;
                gap: 1rem;
            }
            
            /* Pagination */
            .${CSS_CLASSES.PAGINATION} {
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                padding: 1rem;
            }
            
            .${CSS_CLASSES.DOT} {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #ccc;
                border: none;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            
            .${CSS_CLASSES.DOT}.${CSS_CLASSES.ACTIVE} {
                background: var(--arugal-primary);
            }
            
            /* Thumbnails */
            .${CSS_CLASSES.THUMBNAILS} {
                display: flex;
                gap: 0.5rem;
                padding: 1rem;
                overflow-x: auto;
            }
            
            .${CSS_CLASSES.THUMB_ITEM} {
                width: 80px;
                height: 60px;
                object-fit: cover;
                cursor: pointer;
                border: 2px solid transparent;
                border-radius: 4px;
                transition: border-color 0.3s ease;
            }
            
            .${CSS_CLASSES.THUMB_ITEM}.${CSS_CLASSES.ACTIVE} {
                border-color: var(--arugal-primary);
            }
            
            .${CSS_CLASSES.THUMB_ITEM}:hover {
                border-color: var(--arugal-primary);
                opacity: 0.8;
            }
            
            /* Prevent scroll when lightbox is open */
            body.${CSS_CLASSES.PREVENT_SCROLL} {
                overflow: hidden !important;
            }
        `;
        this.stylesheet.update(css);
    }

    /**
     * Scans the DOM for gallery elements matching the selector and initializes them
     * @param selector - CSS selector to find gallery containers
     */
    public scan(selector: string) {
        if (!selector) {
            console.warn('[Arugal] Manager: No selector provided');
            return;
        }
        
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            this.create(el as HTMLElement);
        });
    }

    /**
     * Creates a new gallery instance on a specific element
     * @param element - The HTML element to initialize as a gallery
     * @returns The created gallery instance, or null if creation fails
     */
    public create(element: HTMLElement): GalleryInstance | null {
        if (!element) {
            console.error('[Arugal] Manager: Invalid element provided');
            return null;
        }
        
        // Check if already initialized
        const existing = this.instanceMap.get(element);
        if (existing) {
            console.warn('[Arugal] Manager: Gallery already initialized on this element');
            return existing;
        }
        
        const instance = new GalleryInstance(element, this.options, this.lightbox, this.eventManager);
        this.instances.push(instance);
        this.instanceMap.set(element, instance);
        
        return instance;
    }

    /**
     * Get the gallery instance associated with an element
     */
    public getInstance(element: HTMLElement): GalleryInstance | undefined {
        return this.instanceMap.get(element);
    }

    /**
     * Destroy a specific gallery instance
     */
    public destroyInstance(element: HTMLElement): boolean {
        const instance = this.instanceMap.get(element);
        if (!instance) return false;
        
        instance.destroy();
        this.instanceMap.delete(element);
        this.instances = this.instances.filter(i => i !== instance);
        
        return true;
    }

    /**
     * Destroy all galleries and clean up resources
     */
    public destroy() {
        // Destroy all instances
        this.instances.forEach(i => i.destroy());
        this.instances = [];
        
        // Release reference to shared lightbox
        releaseSharedLightbox();
        
        // Remove all event listeners
        this.eventManager.removeAll();
        
        // Remove stylesheet
        if (this.stylesheet) {
            this.stylesheet.dispose();
        }
        
        // Trigger global destroy callback
        if (this.options.on?.destroy) {
            this.options.on.destroy();
        }
    }
}
