import { InlineOptions, MediaItem, MediaItemInput } from './types';
import { EventManager } from '../dom/events';
import { A11y } from '../utils/a11y';
import { SWIPE_THRESHOLD, DEFAULT_AUTOPLAY_INTERVAL, CSS_CLASSES, ARIA_LABELS, DATA_ATTRIBUTES } from '../utils/constants';
import { UIComponents, EventEmitter } from '../utils/ui-components';
import { createMediaItemFromInput } from '../utils/parser';

export class Carousel extends EventEmitter {
    private element: HTMLElement;
    private options: InlineOptions;
    private eventManager: EventManager;
    private currentSlide = 0;
    private items: MediaItem[];
    private slides: HTMLElement[] = [];
    private intervalId?: number;
    private touchStartX = 0;
    private touchEndX = 0;

    constructor(element: HTMLElement, items: MediaItem[], options: InlineOptions, eventManager: EventManager) {
        super(options.events);
        this.element = element;
        this.items = items;
        this.options = options;
        this.eventManager = eventManager;

        this.init();
    }

    private init() {
        if (!this.element) {
            console.error('[Arugal] Carousel: Invalid element provided');
            return;
        }

        if (this.items.length === 0) {
            console.warn('[Arugal] Carousel: No items provided');
            return;
        }

        this.syncDOM();
        this.applyImageStyles();

        this.slides = Array.from(this.element.querySelectorAll(`.${CSS_CLASSES.ITEM}`)) as HTMLElement[];
        if (this.slides.length === 0) {
            console.warn('[Arugal] Carousel: No slides found in DOM');
            return;
        }

        // A11y
        A11y.setRole(this.element, 'region');
        A11y.setLabel(this.element, ARIA_LABELS.CAROUSEL);

        this.showSlide(0);

        if (this.options.autoplay) {
            this.startAutoplay();
        }

        this.createControls();
        this.createThumbnails();
        this.createPagination();
        this.initGestures();
    }

    private syncDOM() {
        // Ensure all items are in the DOM (external ones might need appending)
        const wrapper = this.element.querySelector('ul') || this.element.appendChild(document.createElement('ul'));
        this.items.forEach(item => {
            if (!wrapper.contains(item.element)) {
                // Wrap in li if not already
                if (item.element.tagName !== 'LI') {
                    const li = document.createElement('li');
                    li.className = CSS_CLASSES.ITEM;
                    li.appendChild(item.element);
                    wrapper.appendChild(li);
                } else {
                    wrapper.appendChild(item.element);
                }
            }
        });
    }

    private applyImageStyles() {
        const objectFit = this.options.objectFit || 'contain';
        
        // Ensure carousel container is positioned relatively for absolute children
        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';

        // Set wrapper (ul) to fill container and act as positioning context
        const wrapper = this.element.querySelector('ul');
        if (wrapper) {
            wrapper.style.position = 'relative';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
            wrapper.style.listStyle = 'none';
            wrapper.style.margin = '0';
            wrapper.style.padding = '0';
        }

        // Set item styles - absolutely positioned to stack, flex for centering
        const items = this.element.querySelectorAll<HTMLElement>(`.${CSS_CLASSES.ITEM}`);
        items.forEach((item) => {
            item.style.position = 'absolute';
            item.style.top = '0';
            item.style.left = '0';
            item.style.width = '100%';
            item.style.height = '100%';
            item.style.display = 'none'; // Hidden by default, showSlide will display
            item.style.alignItems = 'center';
            item.style.justifyContent = 'center';
        });

        // Style images to be as large as possible while maintaining aspect ratio
        const images = this.element.querySelectorAll<HTMLImageElement>(`.${CSS_CLASSES.ITEM} img`);
        images.forEach((img) => {
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.style.objectFit = objectFit;
            img.style.display = 'block';
        });
    }

    private initGestures() {
        this.eventManager.add(this.element, 'touchstart', (e) => {
            this.touchStartX = (e as TouchEvent).changedTouches[0].screenX;
        }, { passive: true });

        this.eventManager.add(this.element, 'touchend', (e) => {
            this.touchEndX = (e as TouchEvent).changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    private handleSwipe() {
        const delta = this.touchEndX - this.touchStartX;
        if (delta < -SWIPE_THRESHOLD) this.next();
        if (delta > SWIPE_THRESHOLD) this.prev();
    }

    private createControls() {
        if (!this.options.navigation) return;

        const container = UIComponents.createNavigationControls(
            () => this.prev(),
            () => this.next(),
            this.eventManager
        );
        
        // Position the controls container for inline carousel
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '0';
        container.style.right = '0';
        container.style.transform = 'translateY(-50%)';
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.pointerEvents = 'none';
        container.style.padding = '0 20px';
        container.style.zIndex = '10';
        
        // Enable pointer events on buttons
        const buttons = container.querySelectorAll('button');
        buttons.forEach((btn: HTMLButtonElement) => {
            btn.style.pointerEvents = 'auto';
        });
        
        this.element.appendChild(container);
    }

    private createThumbnails() {
        if (!this.options.thumbnails) return;

        const container = document.createElement('div');
        container.className = CSS_CLASSES.THUMBNAILS;

        this.items.forEach((item, index) => {
            if (item.thumbnail || item.src) {
                const thumb = document.createElement('img');
                thumb.src = item.thumbnail || item.src || '';
                if (item.srcset) thumb.srcset = item.srcset;
                thumb.className = CSS_CLASSES.THUMB_ITEM + (index === this.currentSlide ? ` ${CSS_CLASSES.ACTIVE}` : '');
                thumb.alt = item.title || `Thumbnail ${index + 1}`;
                
                const onClick = (e: Event) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showSlide(index);
                };
                this.eventManager.add(thumb, 'click', onClick);
                
                container.appendChild(thumb);
            }
        });

        this.element.appendChild(container);
    }

    private createPagination() {
        if (!this.options.pagination) return;

        const container = document.createElement('div');
        container.className = CSS_CLASSES.PAGINATION;
        
        // Position pagination at the bottom of the carousel
        container.style.position = 'absolute';
        container.style.bottom = '10px';
        container.style.left = '0';
        container.style.right = '0';
        container.style.zIndex = '10';

        this.items.forEach((_, index) => {
            const onClick = (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                this.showSlide(index);
            };
            
            const dot = UIComponents.createPaginationDot(
                index,
                index === this.currentSlide,
                onClick,
                this.eventManager
            );
            
            container.appendChild(dot);
        });

        this.element.appendChild(container);
    }

    public showSlide(index: number) {
        if (this.slides.length === 0) return;
        
        if (index < 0) index = this.slides.length - 1;
        if (index >= this.slides.length) index = 0;

        // Hide all slides first
        this.slides.forEach(slide => slide.style.display = 'none');
        // Show only the target slide with flex for centering
        this.slides[index].style.display = 'flex';

        this.currentSlide = index;

        // Update Thumbnails
        if (this.options.thumbnails) {
            const thumbs = this.element.querySelectorAll(`.${CSS_CLASSES.THUMB_ITEM}`);
            UIComponents.updateActiveState(thumbs, index);
        }

        // Update Pagination
        if (this.options.pagination) {
            const dots = this.element.querySelectorAll(`.${CSS_CLASSES.DOT}`);
            UIComponents.updateActiveState(dots, index);
        }

        this.trigger('slideChange', { index: this.currentSlide });
    }

    public next() {
        this.showSlide(this.currentSlide + 1);
    }

    public prev() {
        this.showSlide(this.currentSlide - 1);
    }

    private startAutoplay() {
        this.resumeAutoplay();

        // Implement pauseOnHover functionality (only set up once)
        if (typeof this.options.autoplay === 'object' && this.options.autoplay.pauseOnHover) {
            this.eventManager.add(this.element, 'mouseenter', () => {
                this.pauseAutoplay();
            });
            this.eventManager.add(this.element, 'mouseleave', () => {
                this.resumeAutoplay();
            });
        }
    }

    private resumeAutoplay() {
        if (this.intervalId) clearInterval(this.intervalId);

        let interval = DEFAULT_AUTOPLAY_INTERVAL;

        if (typeof this.options.autoplay === 'object') {
            interval = this.options.autoplay.interval || DEFAULT_AUTOPLAY_INTERVAL;
        }

        this.intervalId = window.setInterval(() => {
            this.next();
        }, interval);
    }

    private pauseAutoplay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    public stopAutoplay() {
        this.pauseAutoplay();
    }

    /**
     * Add items to the carousel dynamically
     * @param inputs - Array of media item inputs to add
     * @returns Array of created MediaItems
     */
    public addItems(inputs: MediaItemInput[]): MediaItem[] {
        const newItems = inputs.map(input => createMediaItemFromInput(input));
        this.items.push(...newItems);
        this.rebuild();
        return newItems;
    }

    /**
     * Set/replace all items in the carousel
     * @param inputs - Array of media item inputs to set
     * @returns Array of created MediaItems
     */
    public setItems(inputs: MediaItemInput[]): MediaItem[] {
        // Clear existing items from DOM
        this.clearDOM();
        
        // Create new items
        this.items = inputs.map(input => createMediaItemFromInput(input));
        this.currentSlide = 0;
        this.rebuild();
        return this.items;
    }

    /**
     * Remove an item at the specified index
     * @param index - Index of item to remove
     * @returns The removed MediaItem or undefined if index is invalid
     */
    public removeItem(index: number): MediaItem | undefined {
        if (index < 0 || index >= this.items.length) return undefined;
        
        const [removed] = this.items.splice(index, 1);
        
        // Adjust current slide if needed
        if (this.currentSlide >= this.items.length) {
            this.currentSlide = Math.max(0, this.items.length - 1);
        }
        
        this.rebuild();
        return removed;
    }

    /**
     * Clear all items from the carousel
     */
    public clear() {
        this.clearDOM();
        this.items = [];
        this.slides = [];
        this.currentSlide = 0;
    }

    /**
     * Get current items
     */
    public getItems(): MediaItem[] {
        return [...this.items];
    }

    /**
     * Get current slide index
     */
    public getCurrentIndex(): number {
        return this.currentSlide;
    }

    /**
     * Clear existing DOM elements
     */
    private clearDOM() {
        const wrapper = this.element.querySelector('ul');
        if (wrapper) {
            // Remove all slides
            const existingItems = wrapper.querySelectorAll(`.${CSS_CLASSES.ITEM}`);
            existingItems.forEach(item => item.remove());
        }
        
        // Remove controls, pagination, thumbnails
        this.element.querySelector(`.${CSS_CLASSES.CONTROLS}`)?.remove();
        this.element.querySelector(`.${CSS_CLASSES.PAGINATION}`)?.remove();
        this.element.querySelector(`.${CSS_CLASSES.THUMBNAILS}`)?.remove();
        
        // Also remove navigation container if present
        const navContainer = this.element.querySelector('[style*="pointer-events: none"]');
        navContainer?.remove();
    }

    /**
     * Rebuild the carousel after items change
     */
    private rebuild() {
        // Clear existing UI
        this.clearDOM();
        
        if (this.items.length === 0) {
            this.slides = [];
            return;
        }
        
        // Re-sync DOM and rebuild
        this.syncDOM();
        this.applyImageStyles();
        
        this.slides = Array.from(this.element.querySelectorAll(`.${CSS_CLASSES.ITEM}`)) as HTMLElement[];
        
        // Recreate UI components
        this.createControls();
        this.createThumbnails();
        this.createPagination();
        
        // Show current slide
        this.showSlide(this.currentSlide);
        
        this.trigger('itemsChanged', { count: this.items.length });
    }

    public dispose() {
        this.stopAutoplay();
        // EventManager cleanup is handled by the parent GalleryInstance
    }
}
