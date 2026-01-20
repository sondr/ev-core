import { MediaItem, MediaItemInput } from '../core/types';
import { DATA_ATTRIBUTES, CSS_CLASSES } from './constants';

/**
 * Normalizes media item data into a consistent MediaItem structure.
 * Used by both DOM parsing and programmatic creation to ensure consistency.
 */
export function normalizeMediaItem(
    element: HTMLElement,
    data: { src?: string; srcset?: string; title?: string; description?: string; type?: MediaItem['type']; thumbnail?: string; alt?: string }
): MediaItem {
    return {
        element,
        src: data.src,
        srcset: data.srcset,
        title: data.title,
        description: data.description,
        type: data.type || 'image',
        thumbnail: data.thumbnail || data.src
    };
}

/**
 * Creates a DOM element and MediaItem from programmatic input.
 */
export function createMediaItemFromInput(input: MediaItemInput): MediaItem {
    const li = document.createElement('li');
    li.className = CSS_CLASSES.ITEM;
    
    const img = document.createElement('img');
    img.src = input.src;
    img.alt = input.alt || input.title || '';
    if (input.srcset) img.srcset = input.srcset;
    if (input.title) img.dataset[DATA_ATTRIBUTES.TITLE] = input.title;
    if (input.description) img.dataset[DATA_ATTRIBUTES.DESCRIPTION] = input.description;
    
    li.appendChild(img);
    
    return normalizeMediaItem(li, input);
}

export class DOMParser {
    /**
     * Parse an existing DOM element into a MediaItem
     */
    static parse(element: HTMLElement): MediaItem {
        if (!element) {
            throw new Error('[Arugal] DOMParser: Invalid element provided');
        }
        
        const img = element.querySelector('img');
        const src = img?.src || element.getAttribute('href') || undefined;
        
        // Parse data attributes (check both container and image)
        const title = element.dataset[DATA_ATTRIBUTES.TITLE] || img?.dataset[DATA_ATTRIBUTES.TITLE];
        const description = element.dataset[DATA_ATTRIBUTES.DESCRIPTION] || img?.dataset[DATA_ATTRIBUTES.DESCRIPTION];
        const srcset = element.dataset[DATA_ATTRIBUTES.SRCSET] || img?.dataset[DATA_ATTRIBUTES.SRCSET] || img?.srcset;

        return normalizeMediaItem(element, { src, srcset, title, description });
    }

    static scanExternal(galleryId: string): HTMLElement[] {
        if (!galleryId || !document) {
            return [];
        }
        
        const selector = `[data-${DATA_ATTRIBUTES.GALLERY_ID}="${galleryId}"]`;
        const externals = document.querySelectorAll(selector);
        return Array.from(externals) as HTMLElement[];
    }
}
