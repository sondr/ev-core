## What the library does
- DOM-driven image carousel + fullscreen lightbox for the EV Core framework.
- Finds galleries automatically by `.cg-container` (auto-init) or via explicit `instances` config.
- Builds a carousel with autoplay, next/prev buttons, touch swipes, optional thumbnails, and per-slide titles/descriptions.
- Opens a fullscreen overlay with its own carousel, menubar (indicator, title, controls), and thumbnails toggle.
- Supports external media elements tagged with `cg-external-include` and `data-cgGalleryId` to inject items into a gallery; respects `data-cgRemove` to optionally remove the source from the DOM.
- Generates dynamic CSS from options (colors, padding, button styles) via a runtime stylesheet builder.

## How to use it
- Install/import: `pnpm add @ev-core/car-gal`; include styles with `import '@ev-core/car-gal/dist/css/index.css';`.
- Markup (auto-init): wrap items in a `.cg-container` containing a `.cg-carousel > ul > li.cg-item` with `<img>` elements. Example:
	```html
	<div id="cars" class="cg-container">
		<div class="cg-carousel">
			<ul>
				<li class="cg-item" data-cgTitle="Model S" data-cgDescription="Red">
					<img src="/img/s.jpg" data-cgSrcset="/img/s-800.jpg 800w, /img/s-1600.jpg 1600w" />
				</li>
			</ul>
		</div>
	</div>
	<!-- External item example -->
	<div class="cg-external-include" data-cgGalleryId="cars" data-cgTitle="Roadster">
		<img src="/img/roadster.jpg" />
	</div>
	```
- Initialize in JS/TS:
	```ts
	import { init, cargalDefaultOpts } from '@ev-core/car-gal';

	const gallery = init({
		autoInit: true, // scans for .cg-container
		defaultOptions: cargalDefaultOpts,
		instances: [
			{
				container: '#cars',
				options: {
					Carousel: { autoplay: true, slideInterval: 8000, thumbnails: true },
					Fullscreen: { closeOnClick: true, Menubar: { fixed: true } }
				}
			}
		],
		Events: { onLoaded: () => console.log('CarGal ready') }
	});
	```
- Config highlights (per-instance `options` merge with `defaultOptions`):
	- `Carousel`: `autoplay`, `autoplayRepeat`, `slideInterval`, `thumbnails`, `padding`, `backgroundColor`, `btns` colors, `Events` callbacks (`onCycle`, `onNext`, `onPrev`, etc.).
	- `Fullscreen`: `closeOnClick`, `background`, `color`, `opacity`, `Menubar` (`fixed`, `background`, `indicator`), `btns`, nested `Carousel` options, `Events` (`onShow`, `onClose`, plus carousel events).
	- Data attributes: `data-cgTitle`, `data-cgDescription`, `data-cgCaptionUrl` (unused in code), `data-cgSrcset` for responsive images.
- Lifecycle: keep the returned `CarGal` instance to call `dispose()` when tearing down the page to remove listeners/DOM it created.

## Current bugs or issues which should be improved
- Scroll lock removal bug: `Overlay.prevent_scroll`/`allow_scroll` use new arrow functions and never call `preventDefault()`, so the touchmove listener is never detached and does not actually block scroll reliably.
- Default options are mutated across galleries: `findGalleries` merges instance options into `_PLATFORM.defaultOptions` directly, so one gallery’s overrides leak into later galleries and the shared defaults are lost.
- Auto-init galleries can end up with missing option objects (e.g., no `options` assigned), yet many constructors assume nested objects exist (`Carousel.btns`, `Fullscreen.Events`), risking runtime errors when markup-only galleries are present.
- External media handling relies on `cgRemove`/cloning but never cleans up listeners on origins if a gallery is disposed without `origin` being tracked consistently.
- No accessibility affordances (no focus trapping in fullscreen, no ARIA labels on controls) and no async image error handling; both are noticeable gaps for production use.

## A plan to migrate this library to a more robust modern version
- Preserve functionality, not API shape: feel free to change public API, class names, CSS, and TS interfaces as long as carousel + fullscreen features remain equivalent. Use best practice.
- Stabilize configuration merging: treat default options as immutable; deep-clone per gallery and validate to ensure `Carousel`, `Fullscreen`, `Events`, and `btns` objects always exist.
- Fix event lifecycle: centralize listener registration/removal with stable references; correct the scroll-lock implementation; add teardown paths for external-media origins and dynamically created elements.
- Modernize packaging: switch to a single TS build with ESM/CJS outputs via a maintained toolchain (tsup/rollup/vite), ship typed CSS imports, and provide a tree-shakable entry plus side-effect metadata.
- Improve DOM + accessibility: add ARIA labels/roles, keyboard navigation parity with mouse/touch, focus trapping in fullscreen, and optional captions/alt fallbacks; handle image loading/errors and progressive srcset swaps more predictably.
- Strengthen API ergonomics: expose a typed `createGallery` helper instead of auto-mutating DOM, support async media sources, and document data-attribute contracts clearly; add hooks for custom renderers.
- Testing & quality: add unit tests for option merging and event lifecycles, integration tests in a headless browser for autoplay/fullscreen/thumbnail flows, and lint/prettier/CI to avoid regressions during the migration.
