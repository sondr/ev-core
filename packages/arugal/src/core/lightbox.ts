import { LightboxOptions, MediaItem } from './types';
import { EventManager, ScrollLock } from '../dom/events';
import { A11y } from '../utils/a11y';
import { CSS_CLASSES, ARIA_LABELS } from '../utils/constants';
import { UIComponents, EventEmitter } from '../utils/ui-components';

/**
 * Shared lightbox instance for all Arugal managers.
 * Ensures only one lightbox can be active at a time across multiple instances.
 */
let sharedLightbox: Lightbox | null = null;
let sharedEventManager: EventManager | null = null;
let referenceCount = 0;

/**
 * Get or create the shared lightbox instance.
 * Multiple Manager instances will share the same lightbox.
 */
export function getSharedLightbox(options: LightboxOptions, eventManager: EventManager): Lightbox {
    if (!sharedLightbox) {
        sharedEventManager = eventManager;
        sharedLightbox = new Lightbox(options, eventManager);
    }
    referenceCount++;
    return sharedLightbox;
}

/**
 * Release a reference to the shared lightbox.
 * When all references are released, the lightbox is disposed.
 */
export function releaseSharedLightbox(): void {
    referenceCount--;
    if (referenceCount <= 0 && sharedLightbox) {
        sharedLightbox.dispose();
        sharedLightbox = null;
        sharedEventManager = null;
        referenceCount = 0;
    }
}

/**
 * Check if the shared lightbox is currently open.
 */
export function isLightboxOpen(): boolean {
    return sharedLightbox?.getIsOpen() ?? false;
}

export class Lightbox extends EventEmitter {
    private overlay: HTMLElement;
    private options: LightboxOptions;
    private eventManager: EventManager;
    private isOpen = false;
    private currentIndex = 0;
    private items: MediaItem[] = [];
    private navButtons: HTMLButtonElement[] = [];

    constructor(options: LightboxOptions, eventManager: EventManager) {
        super(options.events);
        this.options = options;
        this.eventManager = eventManager;

        this.overlay = document.createElement('div');
        this.overlay.className = CSS_CLASSES.OVERLAY;
        this.overlay.style.opacity = '0';
        this.overlay.style.transition = 'opacity 0.3s';
        
        // Apply overlay background color with opacity
        const overlayColor = this.options.overlayColor || 'rgb(0, 0, 0)';
        this.overlay.style.backgroundColor = this.rgbToRgba(overlayColor, this.options.opacity);
        
        this.overlay.setAttribute('role', 'dialog');
        this.overlay.setAttribute('aria-modal', 'true');
        this.overlay.setAttribute('aria-label', ARIA_LABELS.LIGHTBOX);
        this.overlay.tabIndex = -1;

        document.body.appendChild(this.overlay);

        this.initEvents();
    }

    private initEvents() {
        this.eventManager.add(this.overlay, 'click', (e) => {
            if (e.target === this.overlay && this.options.closeOnBackdrop) {
                this.close();
            }
        });

        this.eventManager.add(document, 'keydown', (e) => {
            const event = e as KeyboardEvent;
            if (!this.isOpen || !this.options.keyboard) return;

            if (event.key === 'Escape') {
                this.close();
            } else if (event.key === 'Tab') {
                A11y.trapFocus(this.overlay, event);
            } else if (event.key === 'ArrowLeft') {
                this.prev();
            } else if (event.key === 'ArrowRight') {
                this.next();
            }
        });
    }

    public open(items: MediaItem[], index = 0): void {
        if (!items || items.length === 0) {
            console.warn('[Arugal] Lightbox: No items provided');
            return;
        }
        
        if (index < 0 || index >= items.length) {
            console.warn('[Arugal] Lightbox: Invalid index provided');
            index = 0;
        }
        
        this.items = items;
        this.currentIndex = index;
        this.isOpen = true;
        this.overlay.style.opacity = '1';
        this.overlay.classList.add(CSS_CLASSES.ACTIVE);

        ScrollLock.lock();
        A11y.show(this.overlay);
        this.overlay.focus();

        this.render();
        this.trigger('open');
    }

    private render() {
        // Clean up old nav button event listeners to prevent memory leaks
        this.navButtons.forEach(btn => {
            this.eventManager.remove(btn, 'click', btn.onclick as EventListener);
        });
        this.navButtons = [];
        
        this.overlay.innerHTML = '';

        // Content Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = CSS_CLASSES.LIGHTBOX_CONTENT;

        const item = this.items[this.currentIndex];
        if (item && item.element) {
            const el = item.element.cloneNode(true) as HTMLElement;
            
            // Reset any carousel-specific inline styles that may have been applied
            el.style.position = '';
            el.style.top = '';
            el.style.left = '';
            el.style.width = '';
            el.style.height = '';
            el.style.display = 'block';
            
            // If the element is a container (like li), find and style the actual image
            const img = el.tagName === 'IMG' ? el as HTMLImageElement : el.querySelector('img') as HTMLImageElement;
            if (img) {
                img.style.maxWidth = '100%';
                img.style.maxHeight = '85vh';
                img.style.width = 'auto';
                img.style.height = 'auto';
                img.style.objectFit = 'contain';
                img.style.display = 'block';
                
                if (item.srcset) {
                    img.srcset = item.srcset;
                }
                if (item.title) {
                    img.alt = item.title;
                }
            }
            
            wrapper.appendChild(el);

            if (item.title) {
                const cap = document.createElement('div');
                cap.className = CSS_CLASSES.CAPTION;
                cap.textContent = item.title;
                wrapper.appendChild(cap);
            }
        }
        this.overlay.appendChild(wrapper);

        // Navigation Buttons
        if (this.items.length > 1) {
            const prevBtn = UIComponents.createNavButton('prev', (e) => {
                e.stopPropagation();
                this.prev();
            }, this.eventManager);

            const nextBtn = UIComponents.createNavButton('next', (e) => {
                e.stopPropagation();
                this.next();
            }, this.eventManager);

            this.navButtons.push(prevBtn, nextBtn);
            this.overlay.appendChild(prevBtn);
            this.overlay.appendChild(nextBtn);
        }

        this.trigger('change', { index: this.currentIndex });
    }

    public next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.render();
        this.trigger('next');
    }

    public prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.render();
        this.trigger('prev');
    }

    public close() {
        this.isOpen = false;
        this.overlay.classList.remove(CSS_CLASSES.ACTIVE);
        this.overlay.style.opacity = '0';

        ScrollLock.unlock();
        A11y.hide(this.overlay);
        this.trigger('close');
    }

    /**
     * Check if the lightbox is currently open
     */
    public getIsOpen(): boolean {
        return this.isOpen;
    }

    private rgbToRgba(color: string, opacity: number): string {
        // Handle rgb() format
        if (color.startsWith('rgb(')) {
            return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
        }
        // Handle rgba() format (replace existing alpha)
        if (color.startsWith('rgba(')) {
            return color.replace(/,[^,]*\)$/, `, ${opacity})`);
        }
        // Handle hex colors
        if (color.startsWith('#')) {
            const hex = color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        // Handle named colors - fallback to rgba with black
        return `rgba(0, 0, 0, ${opacity})`;
    }

    public dispose() {
        this.close();
        if (this.overlay.parentElement) {
            this.overlay.parentElement.removeChild(this.overlay);
        }
    }
}
