# Arugal

A modern, accessible, and lightweight JavaScript/TypeScript library for creating beautiful inline carousels and fullscreen lightbox galleries.

## Features

- 🎠 **Inline Carousel** - Responsive carousel with autoplay, navigation arrows, pagination dots, and thumbnails
- 🔍 **Fullscreen Lightbox** - Click any image to view in a fullscreen overlay with keyboard navigation
- ♿ **Accessible** - Built with ARIA labels, focus management, and keyboard support
- 📱 **Touch Support** - Swipe gestures for mobile navigation
- 🎨 **Customizable Themes** - CSS variables for easy styling customization
- 📦 **Lightweight** - No dependencies, minimal footprint
- 🔧 **TypeScript** - Full type definitions included

## Installation

```bash
npm install @ev-core/arugal
# or
pnpm add @ev-core/arugal
```

## Quick Start

### HTML Structure

```html
<div class="arugal-container" id="my-gallery">
    <ul>
        <li class="arugal-item">
            <img src="image1.jpg" alt="Image 1" data-arugal-title="Caption 1">
        </li>
        <li class="arugal-item">
            <img src="image2.jpg" alt="Image 2" data-arugal-title="Caption 2">
        </li>
        <li class="arugal-item">
            <img src="image3.jpg" alt="Image 3">
        </li>
    </ul>
</div>
```

### JavaScript

```javascript
import { Arugal } from '@ev-core/arugal';

// Basic initialization - automatically finds all .arugal-container elements
const manager = Arugal();

// With custom options
const manager = Arugal({
    selector: '.my-gallery',
    theme: {
        primaryColor: '#007bff',
        backgroundColor: '#ffffff',
        textColor: '#333333'
    },
    inline: {
        autoplay: { interval: 3000, pauseOnHover: true },
        navigation: true,
        pagination: true,
        thumbnails: true
    },
    lightbox: {
        keyboard: true,
        closeOnBackdrop: true,
        animation: 'fade',
        opacity: 0.95
    }
});
```

## API

### `Arugal(options?)`

Initializes the gallery manager and automatically scans the DOM for gallery containers.

```typescript
const manager = Arugal(options?: ArugalOptions);
```

Returns a `Manager` instance.

### `create(element, options?)`

Creates a single gallery instance on a specific element. Useful for dynamically added content.

```typescript
const gallery = create(element: HTMLElement, options?: ArugalOptions);
```

Returns a `GalleryInstance` or `null` if initialization fails.

### Manager Methods

| Method | Description |
|--------|-------------|
| `scan(selector)` | Scan DOM for new gallery elements |
| `create(element)` | Create gallery on a specific element |
| `getInstance(element)` | Get gallery instance for an element |
| `destroyInstance(element)` | Destroy a specific gallery |
| `destroy()` | Destroy all galleries and cleanup |

## Configuration Options

### `ArugalOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selector` | `string` | `'.arugal-container'` | CSS selector for gallery containers |
| `theme` | `ThemeOptions` | See below | Theme customization |
| `inline` | `InlineOptions` | See below | Carousel settings |
| `lightbox` | `LightboxOptions` | See below | Lightbox settings |
| `on` | `object` | - | Global event callbacks (`init`, `destroy`) |

### `InlineOptions` (Carousel)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable inline carousel mode |
| `autoplay` | `boolean \| object` | `true` | Enable autoplay (5000ms default) or `{ interval: number, pauseOnHover?: boolean }` |
| `navigation` | `boolean` | `true` | Show prev/next arrows |
| `pagination` | `boolean` | `true` | Show pagination dots |
| `thumbnails` | `boolean` | `false` | Show thumbnail navigation |
| `objectFit` | `string` | `'cover'` | Image fit: `'cover'`, `'contain'`, `'fill'`, `'none'`, `'scale-down'` |
| `zoomOnHover` | `boolean` | `false` | Enable zoom effect on hover |

### `LightboxOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable lightbox mode |
| `keyboard` | `boolean` | `true` | Enable keyboard navigation (arrows, escape) |
| `closeOnBackdrop` | `boolean` | `true` | Close when clicking outside image |
| `animation` | `string` | `'fade'` | Animation style: `'fade'`, `'slide'`, `'none'` |
| `opacity` | `number` | `0.95` | Overlay opacity (0-1) |
| `overlayColor` | `string` | `'rgb(0, 0, 0)'` | Overlay background color |
| `zoomOnHover` | `boolean` | `false` | Enable zoom effect on hover |

### `ThemeOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `primaryColor` | `string` | `'#007bff'` | Primary color for buttons and active states |
| `backgroundColor` | `string` | `'#ffffff'` | Background color |
| `textColor` | `string` | `'#333333'` | Text color |

## Multiple Instances

Arugal supports multiple instances on the same page. The lightbox is shared across all instances, ensuring only one lightbox can be active at a time:

```javascript
import { Arugal, isLightboxOpen } from '@ev-core/arugal';

// Create multiple galleries
const gallery1 = Arugal({ selector: '#gallery-1' });
const gallery2 = Arugal({ selector: '#gallery-2' });

// Check if any lightbox is currently open
if (isLightboxOpen()) {
    console.log('A lightbox is currently open');
}

// Destroy individual instances when done
gallery1.destroy();
gallery2.destroy();
```

## Data Attributes

Add these attributes to your gallery items for additional functionality:

| Attribute | Description |
|-----------|-------------|
| `data-arugal-title` | Caption/title displayed in lightbox |
| `data-arugal-description` | Detailed description |
| `data-arugal-srcset` | Responsive image sources |
| `data-arugal-gallery-id` | Link external items to a gallery |
| `data-arugal-remove` | Remove element from DOM after parsing |

## CSS Classes

The library uses these CSS classes which you can use for custom styling:

| Class | Description |
|-------|-------------|
| `.arugal-container` | Main gallery container |
| `.arugal-item` | Individual gallery item |
| `.arugal-overlay` | Lightbox overlay |
| `.arugal-active` | Active state (slides, dots, thumbnails) |
| `.arugal-controls` | Navigation controls container |
| `.arugal-nav-btn` | Navigation buttons |
| `.arugal-prev` / `.arugal-next` | Previous/Next button modifiers |
| `.arugal-pagination` | Pagination container |
| `.arugal-dot` | Pagination dot |
| `.arugal-thumbnails` | Thumbnails container |
| `.arugal-thumb-item` | Thumbnail item |
| `.arugal-lightbox-content` | Lightbox content wrapper |
| `.arugal-caption` | Image caption |

## CSS Variables

Customize the theme using CSS variables:

```css
:root {
    --arugal-primary: #007bff;
    --arugal-bg: #ffffff;
    --arugal-text: #333333;
}
```

## Keyboard Navigation

When the lightbox is open:

| Key | Action |
|-----|--------|
| `←` Arrow Left | Previous image |
| `→` Arrow Right | Next image |
| `Escape` | Close lightbox |
| `Tab` | Navigate focusable elements (trapped within lightbox) |

## Events

### Carousel Events

```javascript
Arugal({
    inline: {
        events: {
            slideChange: ({ index }) => console.log('Slide changed to:', index)
        }
    }
});
```

### Lightbox Events

```javascript
Arugal({
    lightbox: {
        events: {
            open: () => console.log('Lightbox opened'),
            close: () => console.log('Lightbox closed'),
            change: ({ index }) => console.log('Image changed to:', index),
            next: () => console.log('Next image'),
            prev: () => console.log('Previous image')
        }
    }
});
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

```bash
# Install dependencies
pnpm install

# Build library
pnpm run build

# Watch mode
pnpm run dev

# Run demo
pnpm run demo
```

## License

ISC
