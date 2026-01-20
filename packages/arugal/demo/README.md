# Arugal Demo Site

This demo site showcases all the features of the Arugal library.

## Getting Started

1. **Build the library first:**
   ```bash
   pnpm run build
   ```

2. **Serve the demo:**
   
   You can use any static file server. Here are some options:

   **Option 1: Using Python**
   ```bash
   cd demo
   python -m http.server 8000
   ```
   Then open http://localhost:8000

   **Option 2: Using Node.js http-server**
   ```bash
   npx http-server demo -p 8000
   ```
   Then open http://localhost:8000

   **Option 3: Using VS Code Live Server**
   - Install the "Live Server" extension in VS Code
   - Right-click on `demo/index.html` and select "Open with Live Server"

## Demo Features

### 1. Basic Gallery
Default configuration with all features enabled. Shows standard inline carousel with navigation, pagination, and lightbox support.

### 2. Gallery with Autoplay
Demonstrates autoplay functionality that advances every 3 seconds and pauses on hover.

### 3. Gallery with External Media
Shows how to link images from anywhere on the page using `data-arugal-gallery-id` attribute.

### 4. Gallery with Detailed Descriptions
Each image has both a title and a detailed description, demonstrating metadata support.

### 5. Large Gallery
Performance test with 12 images to ensure smooth operation with larger datasets.

### 6. API Testing
Interactive section with buttons to test the programmatic API:
- Navigate to first/last slide
- Go to previous/next
- Jump to specific slide
- Destroy and reinitialize gallery

### 7. Custom Theme
Gallery initialized with custom colors to demonstrate theming capabilities.

## Testing Checklist

Use this checklist to verify all functionality:

- [ ] Images load correctly
- [ ] Clicking an image opens the lightbox
- [ ] Navigation arrows work in inline carousel
- [ ] Pagination dots work and highlight current slide
- [ ] Keyboard navigation works (arrows, escape)
- [ ] Lightbox closes when clicking backdrop
- [ ] Autoplay gallery advances automatically
- [ ] Autoplay pauses on hover
- [ ] External media loads into the correct gallery
- [ ] API buttons control the gallery correctly
- [ ] Gallery can be destroyed and reinitialized
- [ ] Custom theme colors are applied
- [ ] Mobile touch gestures work (swipe left/right)
- [ ] Focus management and accessibility features work
- [ ] No console errors

## Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## Development Tips

- Open browser DevTools console to see debug messages
- The status box in the API Testing section shows event feedback
- All galleries log their initialization to the console
- Use the Network tab to monitor image loading

## Troubleshooting

**Problem: Gallery doesn't initialize**
- Make sure you ran `pnpm run build` first
- Check the browser console for errors
- Verify the path to `../dist/index.mjs` is correct

**Problem: Images don't load**
- Check your internet connection (images are loaded from picsum.photos)
- Try refreshing the page
- Check browser console for CORS or network errors

**Problem: Styles look wrong**
- Make sure `styles.css` is loaded
- Check for CSS conflicts with browser extensions
- Verify no console errors related to CSS

## File Structure

```
demo/
├── index.html          # Main demo page with multiple gallery examples
├── styles.css          # Demo page styling
├── app.js              # JavaScript to initialize galleries
└── README.md           # This file
```

## Notes

- Images are loaded from [Lorem Picsum](https://picsum.photos) placeholder service
- The demo uses ES modules, so it must be served via HTTP (not opened directly as a file)
- All galleries are initialized in `app.js` with different configurations
