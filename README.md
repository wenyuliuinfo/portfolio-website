# Eva Liu Portfolio

First-pass structure for the Eva Liu portfolio: fixed navigation, full-screen video hero, about/capabilities, featured work, and a compact contact footer.

## Run locally

Open `index.html` directly in a browser, or serve the folder with the quiet
dev server (it suppresses harmless broken-pipe traces from the large video):

```bash
python3 serve.py 4173
```

Then visit `http://localhost:4173`.

## Structure

```text
index.html              semantic page structure and content
styles.css              design system, layout, responsive rules
main.js                 Lenis, GSAP, ScrollTrigger, nav, reveal, parallax
pages/                  two generated project case pages
pages/project-page.css  shared project-page layout and typography
assets/evaliu_logo_white_transparent.png  nav logo
assets/evaliu_logo_black_favicon.png  tightly cropped browser favicon
background_video.mp4    provided hero video
CONTENT.md              source copy for later swaps
```

## Swapping real content

The copy, project cards, stats, and contact links live directly in `index.html`. The project visuals are CSS placeholder scenes; replace the `.project-visual` blocks with real images when you have them.

Tailwind, GSAP, ScrollTrigger, and Lenis load from CDNs. If the page is opened without a network connection, the fallback reveal logic keeps the layout visible and scrollable.

## Production note

The provided `background_video.mp4` is the 61 MB source file. Before deployment, compress it to an H.264 MP4 around 5-10 MB and add a `poster` image on the `<video>` element.
