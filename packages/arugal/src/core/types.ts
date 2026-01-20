/**
 * Configuration options for inline carousel mode
 */
export interface InlineOptions {
    /** Enable inline carousel mode */
    enabled: boolean;
    /** Enable autoplay. Can be boolean or object with interval and pauseOnHover settings */
    autoplay: boolean | { interval: number; pauseOnHover?: boolean };
    /** Show navigation arrows */
    navigation: boolean;
    /** Show pagination dots */
    pagination: boolean;
    /** Show thumbnail navigation */
    thumbnails?: boolean;
    /** Custom CSS class for the carousel container */
    className?: string;
    /** How images should fit within the container. Default: 'cover' (fills space, may crop). Use 'contain' to show full image. */
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    /** Enable zoom effect on hover. Default: false */
    zoomOnHover?: boolean;
    /** Event handlers for carousel events */
    events?: Record<string, unknown>;
}

/**
 * Configuration options for lightbox mode
 */
export interface LightboxOptions {
    /** Enable lightbox mode */
    enabled: boolean;
    /** Enable keyboard navigation (arrows, escape, tab) */
    keyboard: boolean;
    /** Close lightbox when clicking on the backdrop */
    closeOnBackdrop: boolean;
    /** Animation style for opening/closing */
    animation: 'fade' | 'slide' | 'none';
    /** Overlay opacity (0-1) */
    opacity: number;
    /** Overlay background color. Default: 'rgb(0, 0, 0)' (black) */
    overlayColor?: string;
    /** Enable zoom effect on hover. Default: false */
    zoomOnHover?: boolean;
    /** Event handlers for lightbox events */
    events?: Record<string, unknown>;
}

/**
 * Theme customization options
 */
export interface ThemeOptions {
    /** Primary color for buttons and active states */
    primaryColor: string;
    /** Background color for overlays */
    backgroundColor: string;
    /** Text color */
    textColor: string;
}

/**
 * Input type for programmatically adding media items.
 * Used when loading images dynamically through JavaScript.
 */
export interface MediaItemInput {
    /** Source URL (required) */
    src: string;
    /** Responsive image sources */
    srcset?: string;
    /** Image title/caption */
    title?: string;
    /** Detailed description */
    description?: string;
    /** Media type. Default: 'image' */
    type?: 'image' | 'video' | 'embed';
    /** Thumbnail URL. Defaults to src if not provided */
    thumbnail?: string;
    /** Alt text for accessibility */
    alt?: string;
}

/**
 * Represents a media item in the gallery
 */
export interface MediaItem {
    /** The DOM element */
    element: HTMLElement;
    /** Source URL */
    src?: string;
    /** Responsive image sources */
    srcset?: string;
    /** Image title/caption */
    title?: string;
    /** Detailed description */
    description?: string;
    /** Media type */
    type: 'image' | 'video' | 'embed';
    /** Thumbnail URL */
    thumbnail?: string;
}

/**
 * Main configuration options for Arugal galleries
 */
export interface ArugalOptions {
    /** CSS selector to find galleries automatically. Default: '.arugal-container' */
    selector?: string;

    /** Global event callbacks */
    on?: {
        /** Called when manager is initialized */
        init?: (instance: any) => void;
        /** Called when manager is destroyed */
        destroy?: () => void;
    };

    /** Visual customization */
    theme?: ThemeOptions;

    /** Settings for the inline carousel */
    inline?: Partial<InlineOptions>;

    /** Settings for the fullscreen lightbox */
    lightbox?: Partial<LightboxOptions>;
}

/**
 * @deprecated Use ArugalOptions instead. This alias is kept for backward compatibility.
 */
export type CarGalOptions = ArugalOptions;

export const DefaultInlineOptions: InlineOptions = {
    enabled: true,
    autoplay: true, // defaults to 5000ms internally if boolean
    navigation: true,
    pagination: true,
    zoomOnHover: false
};

export const DefaultLightboxOptions: LightboxOptions = {
    enabled: true,
    keyboard: true,
    closeOnBackdrop: true,
    animation: 'fade',
    opacity: 0.95,
    zoomOnHover: false
};

export const DefaultTheme: ThemeOptions = {
    primaryColor: '#007bff',
    backgroundColor: '#ffffff',
    textColor: '#333333'
};
