/**
 * Configuration constants used throughout the library
 */

/** Default autoplay interval in milliseconds */
export const DEFAULT_AUTOPLAY_INTERVAL = 5000;

/** Minimum swipe distance in pixels to trigger navigation */
export const SWIPE_THRESHOLD = 50;

/** CSS class names */
export const CSS_CLASSES = {
    CONTAINER: 'arugal-container',
    ITEM: 'arugal-item',
    OVERLAY: 'arugal-overlay',
    ACTIVE: 'arugal-active',
    CONTROLS: 'arugal-controls',
    PREV: 'arugal-prev',
    NEXT: 'arugal-next',
    THUMBNAILS: 'arugal-thumbnails',
    THUMB_ITEM: 'arugal-thumb-item',
    PAGINATION: 'arugal-pagination',
    DOT: 'arugal-dot',
    LIGHTBOX_CONTENT: 'arugal-lightbox-content',
    CAPTION: 'arugal-caption',
    PREVENT_SCROLL: 'arugal-prevent-scroll',
    NAV_BTN: 'arugal-nav-btn'
} as const;

/** Data attribute names (camelCase for dataset access, kebab-case for selectors) */
export const DATA_ATTRIBUTES = {
    TITLE: 'arugalTitle',
    DESCRIPTION: 'arugalDescription',
    SRCSET: 'arugalSrcset',
    GALLERY_ID: 'arugal-gallery-id',
    REMOVE: 'arugalRemove'
} as const;

/** ARIA labels */
export const ARIA_LABELS = {
    CAROUSEL: 'Image Carousel',
    LIGHTBOX: 'Image Lightbox',
    PREV_BUTTON: 'Previous',
    NEXT_BUTTON: 'Next'
} as const;
