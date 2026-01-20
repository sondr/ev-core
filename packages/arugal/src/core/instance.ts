import { ArugalOptions, InlineOptions, DefaultInlineOptions, MediaItem, MediaItemInput } from './types';
import { EventManager } from '../dom/events';
import { Carousel } from './carousel';
import { deepMerge } from '../utils/merge';
import { Lightbox } from './lightbox';
import { DOMParser } from '../utils/parser';
import { CSS_CLASSES, DATA_ATTRIBUTES } from '../utils/constants';

export class GalleryInstance {
    public readonly element: HTMLElement;
    private options: InlineOptions;
    private eventManager: EventManager;
    private carousel?: Carousel;
    private lightbox: Lightbox;
    private items: MediaItem[] = [];
    private itemClickHandlers: Map<HTMLElement, EventListenerOrEventListenerObject> = new Map();
    private initialized = false;

    constructor(element: HTMLElement, globalConfig: ArugalOptions, sharedLightbox: Lightbox, eventManager: EventManager) {
        this.element = element;
        this.lightbox = sharedLightbox;
        this.eventManager = eventManager;

        this.options = deepMerge({}, DefaultInlineOptions, globalConfig.inline || {});

        this.init();
    }

    private init() {
        if (!this.element) {
            console.error('[Arugal] GalleryInstance: Invalid element provided');
            return;
        }

        // Collect internal items
        const internalNodes = Array.from(this.element.querySelectorAll(`.${CSS_CLASSES.ITEM}`)) as HTMLElement[];
        this.items = internalNodes.map(node => DOMParser.parse(node));

        // Collect external items
        if (this.element.id) {
            const externalNodes = DOMParser.scanExternal(this.element.id);
            const externalItems = externalNodes.map(node => {
                // Remove from DOM if 'data-arugal-remove' attribute is present
                if (node.dataset[DATA_ATTRIBUTES.REMOVE] !== undefined) {
                    node.parentElement?.removeChild(node);
                }
                return DOMParser.parse(node);
            });
            
            // Prepend external items to match legacy CarGal behavior
            this.items = [...externalItems, ...this.items];
        }

        // Initialize carousel if enabled (even if empty - allows dynamic loading)
        if (this.options.enabled) {
            // Ensure ul wrapper exists for dynamic loading
            if (!this.element.querySelector('ul')) {
                const ul = document.createElement('ul');
                this.element.appendChild(ul);
            }
            
            this.carousel = new Carousel(this.element, this.items, this.options, this.eventManager);
        }

        // Setup interaction with lightbox for existing items
        this.setupItemClickHandlers();
        
        this.initialized = true;
    }

    /**
     * Setup click handlers for lightbox interaction
     */
    private setupItemClickHandlers() {
        // Remove old handlers first
        this.itemClickHandlers.forEach((handler, element) => {
            this.eventManager.remove(element, 'click', handler);
        });
        this.itemClickHandlers.clear();
        
        // Add new handlers
        this.items.forEach((item, index) => {
            const handler = (e: Event) => {
                e.preventDefault();
                this.lightbox.open(this.items, index);
            };
            
            this.itemClickHandlers.set(item.element, handler);
            this.eventManager.add(item.element, 'click', handler);
        });
    }

    /**
     * Add items to the gallery dynamically
     * @param inputs - Array of media item inputs to add
     * @returns Array of created MediaItems
     * 
     * @example
     * ```typescript
     * gallery.addItems([
     *   { src: 'image1.jpg', title: 'First Image' },
     *   { src: 'image2.jpg', title: 'Second Image', description: 'A beautiful photo' }
     * ]);
     * ```
     */
    public addItems(inputs: MediaItemInput[]): MediaItem[] {
        if (!this.carousel) {
            console.warn('[Arugal] GalleryInstance: Cannot add items - carousel not initialized');
            return [];
        }
        
        const newItems = this.carousel.addItems(inputs);
        this.items = this.carousel.getItems();
        this.setupItemClickHandlers();
        
        return newItems;
    }

    /**
     * Set/replace all items in the gallery
     * @param inputs - Array of media item inputs to set
     * @returns Array of created MediaItems
     * 
     * @example
     * ```typescript
     * gallery.setItems([
     *   { src: 'new1.jpg', title: 'New Image 1' },
     *   { src: 'new2.jpg', title: 'New Image 2' }
     * ]);
     * ```
     */
    public setItems(inputs: MediaItemInput[]): MediaItem[] {
        if (!this.carousel) {
            console.warn('[Arugal] GalleryInstance: Cannot set items - carousel not initialized');
            return [];
        }
        
        const newItems = this.carousel.setItems(inputs);
        this.items = this.carousel.getItems();
        this.setupItemClickHandlers();
        
        return newItems;
    }

    /**
     * Remove an item at the specified index
     * @param index - Index of item to remove
     * @returns The removed MediaItem or undefined if index is invalid
     */
    public removeItem(index: number): MediaItem | undefined {
        if (!this.carousel) return undefined;
        
        const removed = this.carousel.removeItem(index);
        if (removed) {
            this.items = this.carousel.getItems();
            this.setupItemClickHandlers();
        }
        
        return removed;
    }

    /**
     * Clear all items from the gallery
     */
    public clear() {
        if (this.carousel) {
            this.carousel.clear();
        }
        
        // Remove click handlers
        this.itemClickHandlers.forEach((handler, element) => {
            this.eventManager.remove(element, 'click', handler);
        });
        this.itemClickHandlers.clear();
        
        this.items = [];
    }

    /**
     * Get all items in the gallery
     */
    public getItems(): MediaItem[] {
        return [...this.items];
    }

    /**
     * Get the current slide index
     */
    public getCurrentIndex(): number {
        return this.carousel?.getCurrentIndex() ?? 0;
    }

    /**
     * Navigate to a specific slide
     * @param index - Index of slide to show
     */
    public goTo(index: number) {
        this.carousel?.showSlide(index);
    }

    /**
     * Go to the next slide
     */
    public next() {
        this.carousel?.next();
    }

    /**
     * Go to the previous slide
     */
    public prev() {
        this.carousel?.prev();
    }

    /**
     * Open the lightbox at a specific index
     * @param index - Index of item to open (defaults to current slide)
     */
    public openLightbox(index?: number) {
        if (this.items.length === 0) return;
        const targetIndex = index ?? this.getCurrentIndex();
        this.lightbox.open(this.items, targetIndex);
    }

    public destroy() {
        // Clean up carousel
        if (this.carousel) {
            this.carousel.dispose();
            this.carousel = undefined;
        }
        
        // Remove click handlers for lightbox
        this.itemClickHandlers.forEach((handler, element) => {
            this.eventManager.remove(element, 'click', handler);
        });
        this.itemClickHandlers.clear();
        
        // Clear items
        this.items = [];
        this.initialized = false;
    }
}
