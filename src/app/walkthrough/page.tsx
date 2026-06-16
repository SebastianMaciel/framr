import type { Metadata } from "next";
import Link from "next/link";
import "./walkthrough.css";
import WalkChrome from "./WalkChrome";
import WalkDiagram from "./WalkDiagram";
import { Code, Tree } from "./Code";

export const metadata: Metadata = {
  title: "FRAMR.: how it works, inside out",
  description: "Technical walkthrough of FRAMR.",
};

export default function WalkthroughEN() {
  return (
    <WalkChrome lang="en">
      <section className="wk-hero">
        <p className="wk-kicker">00 / CODE GUIDE</p>
        <h1 className="wk-h1">
          HOW
          <br />
          THIS
          <br />
          WORKS.
        </h1>
        <p className="wk-lede">
          A technical read of FRAMR. Every decision, every file, every bit of math, explained.
        </p>
        <p>
          This isn&apos;t a marketing README, it&apos;s the project&apos;s internal guide. To understand why something is built the way it is, it&apos;s here. Recommended reading order: top to bottom, though each section stands on its own.
        </p>
      </section>

      <div className="wk-wrap">
        <nav className="wk-toc" aria-label="Table of contents">
          <h2>INDEX</h2>
          <ol>
            <li><a href="#overview">Bird&apos;s-eye view</a></li>
            <li><a href="#files">File map</a></li>
            <li><a href="#catalog">Platform catalog</a></li>
            <li><a href="#transform">The transform model</a></li>
            <li><a href="#computeFrame">computeFrame, step by step</a></li>
            <li><a href="#state">Page state</a></li>
            <li><a href="#uploader">Uploader</a></li>
            <li><a href="#presetcard">PresetCard (the juicy one)</a></li>
            <li><a href="#pan">Pan: how dragging works</a></li>
            <li><a href="#zoom">Zoom: wheel + slider</a></li>
            <li><a href="#skeleton">Skeleton + fade</a></li>
            <li><a href="#fits">The upscale check</a></li>
            <li><a href="#export">WebP export</a></li>
            <li><a href="#zip">ZIP generation</a></li>
            <li><a href="#brutalism">Brutalism, applied</a></li>
            <li><a href="#a11y">A11y: what was done and why</a></li>
            <li><a href="#decisions">Decisions and trade-offs</a></li>
          </ol>
        </nav>

        <main id="content">
          <section id="overview" className="wk-section">
            <h2 className="s">01 / Bird&apos;s-eye view</h2>
            <p>
              FRAMR is a <strong>100% client-side app</strong>. No backend, no database, no uploads to any server. All image processing happens in the browser using the <code className="i">Canvas API</code>.
            </p>
            <p>The flow is simple:</p>
            <ol>
              <li>The user uploads an image (drag-drop or file picker).</li>
              <li>The browser loads it into an <code className="i">HTMLImageElement</code> and stores its dimensions.</li>
              <li>For each of the 23 platform presets, an interactive preview is rendered.</li>
              <li>The user repositions/zooms each frame with drag + scroll/slider.</li>
              <li>On download, the image is drawn onto a <code className="i">&lt;canvas&gt;</code> at the exact preset size, converted to WebP via <code className="i">canvas.toBlob()</code>, and a download is triggered.</li>
              <li>ZIPs are built with JSZip in the browser, also network-free.</li>
            </ol>

            <WalkDiagram
              labels={{
                ariaLabel: "Data flow",
                image: "IMAGE",
                catalog: "Preset catalog",
                catalogSub: "23 formats · lib/platforms",
                transformsTitle: "Transforms state",
                transformsSub: "zoom · cx · cy per preset",
                presetCardTitle: "PresetCard ×23",
                presetCardSub1: "interactive preview",
                presetCardSub2: "drag + zoom",
                computeFrameTitle: "computeFrame(): the same function",
                computeFrameSub: "for the preview AND the export canvas",
              }}
            />

            <div className="wk-why">
              <span className="tag">WHY THIS WAY?</span>
              The most important rule: <strong>the source image never leaves the browser</strong>. It&apos;s a strong privacy argument (no explanation needed for creators) and it also saves the cost of a backend. Everything Canvas API needs has been in the browser for years.
            </div>
          </section>

          <section id="files" className="wk-section">
            <h2 className="s">02 / File map</h2>
            <p>The app is small, but everything has its place:</p>
            <Tree
              html={`src/
├── app/
│   ├── layout.tsx              <span class="com"># fonts, skip-link, lang="en"</span>
│   ├── globals.css             <span class="com"># tokens, focus-visible, reduced-motion</span>
│   ├── page.tsx                <span class="com"># main app (Uploader + grid of PresetCards)</span>
│   ├── page.module.css
│   ├── ui-kit/
│   │   ├── page.tsx            <span class="com"># /ui-kit: design system showcase</span>
│   │   └── page.module.css
│   └── walkthrough/
│       ├── page.tsx            <span class="com"># /walkthrough: this very doc (EN)</span>
│       └── es/page.tsx         <span class="com"># /walkthrough/es: ES version</span>
├── components/
│   ├── Header.tsx              <span class="com"># FRAMR. + WALKTHROUGH + UI KIT button</span>
│   ├── Header.module.css
│   ├── Uploader.tsx            <span class="com"># drag & drop + picker</span>
│   ├── Uploader.module.css
│   ├── PresetCard.tsx          <span class="com"># interactive preview + per-preset download</span>
│   └── PresetCard.module.css
└── lib/
    ├── platforms.ts            <span class="com"># the 23 presets (Instagram, TikTok, etc.)</span>
    ├── transform.ts            <span class="com"># crop math (zoom·cx·cy → tx·ty·scale)</span>
    └── export.ts               <span class="com"># canvas → WebP → ZIP</span>`}
            />
            <p>Rules enforced in this tree:</p>
            <ul>
              <li>Components in <code className="i">components/</code>, pure logic in <code className="i">lib/</code>, pages in <code className="i">app/</code>. No catch-all <em>utils.ts</em>.</li>
              <li>Every component has its <code className="i">.module.css</code> next to it. No Tailwind. Every class is scoped to its file.</li>
              <li>Nothing in <code className="i">lib/</code> imports from <code className="i">components/</code>. One-way dependency only.</li>
            </ul>
          </section>

          <section id="catalog" className="wk-section">
            <h2 className="s">03 / Platform catalog</h2>
            <p>
              The dimensions for each social network live hardcoded in <code className="i">lib/platforms.ts</code>. They&apos;re static data, officially valid for 2026, sourced from help centers and reference blogs (Buffer, Hootsuite, etc.).
            </p>
            <Code
              lang="typescript"
              code={`export type Preset = {
  id: string;          // "ig_feed_portrait", unique
  label: string;       // "Feed Portrait"
  width: number;       // 1080
  height: number;      // 1350
  ratio: string;       // "4:5" (info, not used in math)
  minWidth: number;    // 320 (platform-recommended minimum)
};

export type Platform = {
  id: string;          // "instagram"
  name: string;        // "Instagram"
  color: string;       // "#E4405F" (legacy, overridden in CSS)
  presets: Preset[];
};`}
            />
            <p>Six platforms with a total of 23 presets. Some examples:</p>
            <table>
              <thead><tr><th>Platform</th><th>Preset</th><th>Dim</th><th>Ratio</th></tr></thead>
              <tbody>
                <tr><td>Instagram</td><td>Feed Portrait</td><td>1080 × 1350</td><td>4:5</td></tr>
                <tr><td>Instagram</td><td>Story / Reel</td><td>1080 × 1920</td><td>9:16</td></tr>
                <tr><td>TikTok</td><td>Video Cover</td><td>1080 × 1920</td><td>9:16</td></tr>
                <tr><td>YouTube</td><td>Thumbnail</td><td>1280 × 720</td><td>16:9</td></tr>
                <tr><td>YouTube</td><td>Channel Banner</td><td>2560 × 1440</td><td>16:9</td></tr>
                <tr><td>X (Twitter)</td><td>Header</td><td>1500 × 500</td><td>3:1</td></tr>
                <tr><td>LinkedIn</td><td>Personal Banner</td><td>1584 × 396</td><td>4:1</td></tr>
                <tr><td>Facebook</td><td>Cover Photo</td><td>851 × 315</td><td>2.7:1</td></tr>
              </tbody>
            </table>
            <p>The file also exports two small helpers:</p>
            <Code
              lang="typescript"
              code={`export function getCoverScale(imgW, imgH, presetW, presetH) {
  return Math.max(presetW / imgW, presetH / imgH);
}

export function meetsRequirement(imgW, imgH, preset) {
  return imgW >= preset.width && imgH >= preset.height;
}`}
            />
            <p>
              <code className="i">getCoverScale</code> tells how much the image needs to be enlarged to completely cover a preset. If it returns &gt; 1, the image needs upscaling (and will be pixelated). It&apos;s the foundation for the <code className="i">⚠ +N%</code> warning.
            </p>
          </section>

          <section id="transform" className="wk-section">
            <h2 className="s">04 / The transform model</h2>
            <p>
              This is the most important piece of the whole project. It&apos;s where the math that keeps the crop coherent between what&apos;s seen on screen and what&apos;s downloaded lives.
            </p>
            <h3>The problem</h3>
            <p>
              We need to represent &quot;how this image is cropped for this preset&quot; with a small object that is <strong>independent of the preview dimensions</strong>. Why? Because the preview is displayed at 240px, but the export happens at 1080×1920 or 2560×1440. The same &quot;crop configuration&quot; has to work for both.
            </p>
            <h3>The solution: 3 numbers</h3>
            <Code
              lang="typescript"
              code={`export type Transform = {
  zoom: number;  // >= 1, multiplier on top of "cover fit"
  cx: number;    // 0..1, horizontal center position in image coords
  cy: number;    // 0..1, vertical center position in image coords
};`}
            />
            <p>The mental model:</p>
            <ul>
              <li><code className="i">zoom = 1</code> means &quot;the image exactly covers the frame&quot; (cover-fit).</li>
              <li><code className="i">zoom = 2</code> means &quot;twice as big&quot; → less image visible but with more detail.</li>
              <li><code className="i">cx = 0.5, cy = 0.5</code> places the image center at the frame center.</li>
              <li><code className="i">cx = 0.2</code> means &quot;looking at 20% horizontally into the image&quot;, so the focus shifts to the left.</li>
            </ul>
            <div className="wk-why">
              <span className="tag">WHY NOT STORE tx, ty, scale?</span>
              Because those values are tied to a specific frame size. If <code className="i">tx = 120px</code> is stored, that means different things for a 240px frame versus a 1080px frame. By storing a <strong>normalized focal point</strong> (0..1) and a relative zoom, the same config works for any output size. It&apos;s resolution-independent.
            </div>
          </section>

          <section id="computeFrame" className="wk-section">
            <h2 className="s">05 / <code className="i">computeFrame()</code>, step by step</h2>
            <p>
              This function takes an abstract transform and a frame size, and returns the concrete pixel values for rendering.
            </p>
            <Code
              lang="typescript"
              code={`export function computeFrame(
  imgW, imgH, frameW, frameH, t
) {
  // 1. The minimum scale that guarantees cover (image fills the frame).
  const base = Math.max(frameW / imgW, frameH / imgH);

  // 2. Effective scale includes the user's zoom.
  const scale = base * t.zoom;
  const renderedW = imgW * scale;
  const renderedH = imgH * scale;

  // 3. Compute tx, ty so (cx, cy) lands at the frame center.
  let tx = frameW / 2 - t.cx * renderedW;
  let ty = frameH / 2 - t.cy * renderedH;

  // 4. Clamp: the image must never leave a blank edge.
  const minTx = frameW - renderedW;  // most negative allowed
  const minTy = frameH - renderedH;
  if (tx > 0) tx = 0;
  if (ty > 0) ty = 0;
  if (tx < minTx) tx = minTx;
  if (ty < minTy) ty = minTy;

  return { scale, renderedW, renderedH, tx, ty };
}`}
            />
            <h3>Worked example with real numbers</h3>
            <p>Image 2400×1600, preset 1080×1920 (vertical 9:16), zoom 1, cx 0.5, cy 0.5:</p>
            <ol>
              <li><code className="i">base = max(1080/2400, 1920/1600) = max(0.45, 1.2) = <strong>1.2</strong></code>: the image needs to grow 20% to cover vertically.</li>
              <li><code className="i">scale = 1.2 * 1 = 1.2</code></li>
              <li><code className="i">renderedW = 2400 * 1.2 = 2880</code>, <code className="i">renderedH = 1600 * 1.2 = 1920</code> (just right).</li>
              <li><code className="i">tx = 1080/2 - 0.5 * 2880 = 540 - 1440 = -900</code> (the image shifts left).</li>
              <li><code className="i">ty = 1920/2 - 0.5 * 1920 = 960 - 960 = 0</code>.</li>
              <li>Clamp: <code className="i">minTx = 1080 - 2880 = -1800</code>. <code className="i">-900</code> sits between <code className="i">-1800</code> and <code className="i">0</code>, OK.</li>
            </ol>
            <p>Result: the image is drawn at 2880×1920, shifted 900px to the left, showing the central 1080 horizontal pixels and all 1920 verticals. Perfect cover.</p>
            <h3>The sibling: <code className="i">clampedTransform()</code></h3>
            <p>
              When the user drags or changes zoom, the resulting <code className="i">cx</code>/<code className="i">cy</code> may fall outside the valid range (trying to view past the image edge). Instead of letting it through and clamping only at render time, the <code className="i">cx</code>/<code className="i">cy</code> themselves are adjusted before saving to state. That keeps the values consistent.
            </p>
          </section>

          <section id="state" className="wk-section">
            <h2 className="s">06 / Page state</h2>
            <p>
              The whole app is a single React component (<code className="i">app/page.tsx</code>) with three pieces of state:
            </p>
            <Code
              lang="tsx"
              code={`const [loaded, setLoaded] = useState<LoadedImage | null>(null);
const [transforms, setTransforms] = useState<Record<string, Transform>>({});
const [zipping, setZipping] = useState<string | null>(null);`}
            />
            <ul>
              <li><code className="i">loaded</code>: the image already loaded as an <code className="i">HTMLImageElement</code> plus its filename. Null when nothing has been uploaded yet.</li>
              <li><code className="i">transforms</code>: an object <em>keyed by preset id</em>. Every preset the user has touched has its own transform; untouched ones fall back to <code className="i">DEFAULT_TRANSFORM</code> ({"{"} zoom: 1, cx: 0.5, cy: 0.5 {"}"}).</li>
              <li><code className="i">zipping</code>: a string identifying what&apos;s being zipped (&quot;all&quot;, &quot;instagram&quot;, etc.) or null. Used to disable other buttons while it runs.</li>
            </ul>
            <div className="wk-why">
              <span className="tag">WHY HTMLImageElement AND NOT A BLOB URL?</span>
              Because <code className="i">naturalWidth</code> and <code className="i">naturalHeight</code> are needed a thousand times for the math. Having the element already loaded avoids creating and awaiting new images on every render. On top of that, <code className="i">ctx.drawImage()</code> on canvas accepts an HTMLImageElement directly.
            </div>
          </section>

          <section id="uploader" className="wk-section">
            <h2 className="s">07 / Uploader</h2>
            <p>The simplest component in the app, but with a couple of a11y details worth noting.</p>
            <h3>Structure</h3>
            <p>
              A <code className="i">&lt;div&gt;</code> with <code className="i">role=&quot;button&quot;</code> and <code className="i">tabIndex={"{0}"}</code> that acts as both the dropzone AND the file picker trigger:
            </p>
            <Code
              lang="tsx"
              code={`<div
  role="button"
  tabIndex={0}
  onDragOver={onDragOver}
  onDragLeave={onDragLeave}
  onDrop={onDrop}
  onClick={openPicker}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") openPicker();
  }}
>
  <input type="file" ref={inputRef} hidden />
  <h1>DROP. AN. IMAGE.</h1>
  {/* ... */}
</div>`}
            />
            <div className="wk-note">
              <span className="tag">WHY NOT USE &lt;button&gt; DIRECTLY?</span>
              HTML semantics: a <code className="i">&lt;button&gt;</code> isn&apos;t supposed to contain an <code className="i">&lt;h1&gt;</code> or an <code className="i">&lt;input&gt;</code> inside it (the spec forbids interactive descendants). With a div + role=&quot;button&quot; + tabIndex + Enter/Space handling the same accessibility is achieved without breaking semantics. Lighthouse accepts it.
            </div>
            <h3>Validation</h3>
            <p>When a file arrives, a minimal check runs:</p>
            <Code
              lang="typescript"
              code={`if (!file.type.startsWith("image/")) {
  setError("THAT'S NOT AN IMAGE.");
  return;
}`}
            />
            <p>There&apos;s no max-size validation or anything similar. More validations can always be added later as needed (a <code className="i">file.size</code> check, specific formats, whatever fits).</p>
          </section>

          <section id="presetcard" className="wk-section">
            <h2 className="s">08 / PresetCard: the juicy component</h2>
            <p>Almost all the interactive code lives here. It&apos;s responsible for showing the preview of a preset and enabling crop + download.</p>
            <h3>Anatomy</h3>
            <Code
              lang="html"
              code={`<article>                              <!-- whole card, a11y: aria-labelledby -->
  <header>                             <!-- preset label + target dimensions -->
    <h3>Feed Portrait</h3>
    <span>1080×1350</span>
  </header>
  <div>                                <!-- frame with overflow:hidden + drag handlers -->
    <img />                            <!-- real image, positioned via transform -->
    <div>skeleton shimmer</div>        <!-- initial 400ms -->
    <span>⚠ +28%</span>                <!-- badge if upscale is needed -->
    <span>↔ DRAG · ⇕ ZOOM</span>       <!-- hint on hover -->
  </div>
  <div>                                <!-- controls: zoom slider + reset -->
    <input type="range" />
    <button>RESET</button>
  </div>
  <button>↓ GIMME .WEBP</button>
</article>`}
            />
            <p>The frame shows the preview at a small size (<code className="i">MAX_DISPLAY = 240px</code> on the longer axis), but mathematically it represents the same crop as the export canvas.</p>
          </section>

          <section id="pan" className="wk-section">
            <h2 className="s">09 / Pan: how dragging works</h2>
            <p>Dragging uses <strong>Pointer Events</strong> (not mouse events). Pointer events work uniformly for mouse + touch + pen, and they support <code className="i">setPointerCapture()</code>, which is key.</p>
            <h3>The flow</h3>
            <Code
              lang="tsx"
              code={`// onPointerDown
(e) => {
  e.target.setPointerCapture(e.pointerId);  // target retains the events
  dragRef.current = {
    startX: e.clientX, startY: e.clientY,
    startCx: transform.cx, startCy: transform.cy,
    scale: math.scale,  // current effective scale
  };
};

// onPointerMove
(e) => {
  const d = dragRef.current;
  if (!d) return;
  const dx = e.clientX - d.startX;
  const dy = e.clientY - d.startY;
  // Convert pixel delta to delta in normalized image coords.
  const cx = d.startCx - dx / (imgW * d.scale);
  const cy = d.startCy - dy / (imgH * d.scale);
  onTransformChange(clampedTransform(/* ... */, { zoom, cx, cy }));
};

// onPointerUp
() => { dragRef.current = null; };`}
            />
            <div className="wk-note">
              <span className="tag">WHY useRef FOR DRAG STATE?</span>
              Because there&apos;s no need to re-render when a drag starts. The only requirement is storing the starting positions and reading them in <code className="i">onPointerMove</code>. If it were <code className="i">useState</code>, every <code className="i">onPointerDown</code> would trigger a pointless re-render. <code className="i">useRef</code> is the idiomatic way to store &quot;instance variables&quot; in React.
            </div>
            <div className="wk-why">
              <span className="tag">THE setPointerCapture TRICK</span>
              Without pointer capture, if the user drags fast and the cursor leaves the frame, <code className="i">onPointerMove</code> events stop arriving and the drag gets stuck. <code className="i">setPointerCapture</code> makes the original target keep receiving all events until <code className="i">pointerup</code>, even outside the element. Smooth dragging guaranteed.
            </div>
          </section>

          <section id="zoom" className="wk-section">
            <h2 className="s">10 / Zoom: wheel + slider</h2>
            <p>Two ways to zoom inside each frame.</p>
            <h3>HTML slider</h3>
            <p>
              An <code className="i">&lt;input type=&quot;range&quot; min={"{1}"} max={"{4}"} step={"{0.01}"}&gt;</code>. Trivial. It has a visually-hidden <code className="i">&lt;label htmlFor&gt;</code> associated for screen readers.
            </p>
            <h3>Native wheel listener (not React)</h3>
            <p>
              There&apos;s a trick here. React, by default, registers <code className="i">onWheel</code> listeners as <strong>passive</strong>, which means <code className="i">e.preventDefault()</code> doesn&apos;t work and the page keeps scrolling. To prevent that, the listener is registered via useEffect with <code className="i">{"{"} passive: false {"}"}</code> directly on the DOM:
            </p>
            <Code
              lang="tsx"
              code={`useEffect(() => {
  const el = frameRef.current;
  if (!el) return;
  const handler = (e) => {
    e.preventDefault();   // works thanks to passive: false
    const delta = -e.deltaY * 0.002;
    const zoom = transform.zoom * (1 + delta);
    onTransformChange(clampedTransform(/* ... */, { zoom, cx, cy }));
  };
  el.addEventListener("wheel", handler, { passive: false });
  return () => el.removeEventListener("wheel", handler);
}, [/* deps */]);`}
            />
            <div className="wk-why">
              <span className="tag">BONUS: TRACKPAD PINCH</span>
              On Mac, trackpad pinch generates <strong>wheel events with ctrlKey</strong>. The handler doesn&apos;t check ctrlKey and treats any deltaY as zoom, so trackpad pinch <em>works for free</em>. Multi-touch pinch on mobile would require additional logic with two simultaneous pointers.
            </div>
          </section>

          <section id="skeleton" className="wk-section">
            <h2 className="s">11 / Skeleton + fade: deliberate UX</h2>
            <p>When a new image is loaded, each PresetCard shows 400ms of skeleton (animated diagonal stripes) and then the image appears with a 320ms fade.</p>
            <Code
              lang="tsx"
              code={`const [skeleton, setSkeleton] = useState(true);

useEffect(() => {
  setSkeleton(true);                                // reset on every new image load
  const id = setTimeout(() => setSkeleton(false), 400);
  return () => clearTimeout(id);
}, [image.src]);`}
            />
            <div className="wk-why">
              <span className="tag">WHY FORCE AN ARTIFICIAL DELAY?</span>
              The processing is so fast that without the skeleton it looks like nothing happened. Perceived performance matters: 400ms of skeleton + fade generates the feeling of <em>&quot;it&apos;s processing&quot;</em>, which validates the work in the user&apos;s eyes. It&apos;s intentional UX, not a bug.
            </div>
            <p>The fade uses a CSS transition on <code className="i">opacity</code>. The skeleton is a <code className="i">background: repeating-linear-gradient</code> with a <code className="i">@keyframes shimmer</code> animation that moves the pattern at 0.8s/loop.</p>
          </section>

          <section id="fits" className="wk-section">
            <h2 className="s">12 / The upscale check (warning)</h2>
            <p>When an image is smaller than a preset, it isn&apos;t blocked: it&apos;s left downloadable but with a visual warning.</p>
            <Code
              lang="typescript"
              code={`const coverScale = getCoverScale(imgW, imgH, preset.width, preset.height);
const upscalePct = Math.round((coverScale - 1) * 100);
const fits = coverScale <= 1;`}
            />
            <p>If <code className="i">coverScale &gt; 1</code>, the image needs to be enlarged to cover the preset. It will look pixelated. The UI shows:</p>
            <ul>
              <li>A <strong>magenta</strong> badge in the frame corner: <code className="i">⚠ +28%</code>.</li>
              <li>The download button switches to magenta and reads <code className="i">↓ GIMME (UPSCALED +28%)</code>.</li>
              <li>The download is still possible. The user decides.</li>
            </ul>
          </section>

          <section id="export" className="wk-section">
            <h2 className="s">13 / WebP export</h2>
            <p>The central function that converts a transform into a WebP Blob:</p>
            <Code
              lang="typescript"
              code={`export async function renderPresetToBlob(image, preset, transform) {
  const canvas = document.createElement("canvas");
  canvas.width = preset.width;        // canvas at exact preset size
  canvas.height = preset.height;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high"; // best available resampling

  const m = computeFrame(
    image.naturalWidth, image.naturalHeight,
    preset.width, preset.height,
    transform,
  );
  ctx.drawImage(image, m.tx, m.ty, m.renderedW, m.renderedH);

  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/webp", 0.92),
  );
}`}
            />
            <p>The key: <code className="i">computeFrame()</code> is called with <strong>the canvas dimensions, not the preview&apos;s</strong>. The same function produces correct values for any scale, which is why what&apos;s shown small on screen is exactly what ends up in the WebP.</p>
            <h3>The download</h3>
            <Code
              lang="typescript"
              code={`export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);   // free memory
}`}
            />
            <div className="wk-note">
              <span className="tag">WHY Q=0.92?</span>
              It&apos;s the WebP sweet spot: 92% keeps the image visually indistinguishable from the original while saving ~30% size versus q=100. Below 80, subtle artifacts start appearing on fine edges in photographs.
            </div>
          </section>

          <section id="zip" className="wk-section">
            <h2 className="s">14 / ZIPs in the browser</h2>
            <p><strong>JSZip</strong> is used (the only dependency that doesn&apos;t come with Next.js). It generates ZIPs in memory without touching the disk.</p>
            <Code
              lang="typescript"
              code={`export async function buildZip(image, imageName, presets, transforms) {
  const zip = new JSZip();
  for (const preset of presets) {
    const blob = await renderPresetToBlob(
      image, preset,
      transforms[preset.id] ?? DEFAULT_TRANSFORM,
    );
    if (blob) zip.file(fileNameFor(imageName, preset), blob);
  }
  return zip.generateAsync({ type: "blob" });
}`}
            />
            <div className="wk-why">
              <span className="tag">WHY SEQUENTIAL AND NOT Promise.all?</span>
              Each <code className="i">toBlob()</code> on a large canvas (2560×1440 for example) eats RAM. Doing them in parallel on mobile crashes the page. Sequential is ~1s for all 23 presets on a medium image, acceptable. The UI shows &quot;ZIPPING…&quot; so it&apos;s clear there&apos;s work in progress.
            </div>
            <p>There are three entry points to <code className="i">buildZip</code>:</p>
            <ul>
              <li><strong>ZIP ALL (23)</strong>: cyan button next to SWAP, includes every preset.</li>
              <li><strong>DOWNLOAD SET</strong>: one button per platform on its band, includes only that platform&apos;s presets.</li>
              <li><strong>Single .webp</strong>: the ↓ GIMME button on each card, doesn&apos;t use ZIP, it&apos;s a direct download.</li>
            </ul>
          </section>

          <section id="brutalism" className="wk-section">
            <h2 className="s">15 / Brutalism, applied</h2>
            <p>The entire aesthetic follows 7 rules, also listed at <Link href="/ui-kit"><code className="i">/ui-kit</code></Link>:</p>
            <ol>
              <li>Sharp corners only. No <code className="i">border-radius</code>.</li>
              <li>3px black borders on anything with a boundary.</li>
              <li>Hover states <em>thunk</em>: <code className="i">translate(-2px, -2px) + box-shadow: 4px 4px 0 color</code>. No blur.</li>
              <li>Copy is uppercase and confrontational. Period as punctuation, not whisper.</li>
              <li>Saturated palette (yellow, magenta, cyan, red). Never pastel.</li>
              <li>Official brand colors (with minimal darkening on YT and FB for WCAG).</li>
              <li>Warnings are not blockers. Show the cost, let the user decide.</li>
            </ol>
            <h3>Tokens</h3>
            <p>Defined in <code className="i">globals.css</code> via CSS custom properties:</p>
            <Code
              lang="css"
              code={`:root {
  --paper: #ffffff;
  --ink: #000000;
  --yellow: #fff200;     /* primary action */
  --magenta: #ff0066;    /* warnings, upscale */
  --cyan: #00e0ff;       /* secondary action (ZIP ALL) */
  --red: #ff2200;
  --lime: #c4ff00;       /* reserve (unused) */

  --line-w: 3px;

  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}`}
            />
            <div className="wk-why">
              <span className="tag">WHY CSS MODULES AND NOT TAILWIND?</span>
              Brutalism doesn&apos;t need a large design system: tokens + Space Grotesk + 4 colors + 3 rules cover it. CSS Modules give per-file scoping at zero runtime cost. Tailwind would add unnecessary complexity for this scope.
            </div>
          </section>

          <section id="a11y" className="wk-section">
            <h2 className="s">16 / A11y: what was done and why</h2>
            <p>Lighthouse a11y score: <strong>100/100</strong> on both <code className="i">/</code> and <code className="i">/ui-kit</code>. Coverage:</p>
            <table>
              <thead><tr><th>Category</th><th>What was done</th></tr></thead>
              <tbody>
                <tr><td>Skip link</td><td>&quot;Skip to content&quot; link at the start of body, visible only when focused. Points to <code className="i">#content</code> which is the <code className="i">&lt;main&gt;</code>.</td></tr>
                <tr><td>Heading hierarchy</td><td>One single <code className="i">&lt;h1&gt;</code> per page. On home: &quot;DROP. AN. IMAGE.&quot; (no-loaded) or the filename (loaded). On /ui-kit: &quot;WEB BRUTALISM.&quot; Then h2 for platforms and h3 for presets.</td></tr>
                <tr><td>Landmarks</td><td><code className="i">&lt;header&gt;</code>, <code className="i">&lt;nav aria-label=&quot;Primary&quot;&gt;</code>, <code className="i">&lt;main id=&quot;content&quot;&gt;</code>, <code className="i">&lt;section aria-labelledby&gt;</code>, <code className="i">&lt;footer&gt;</code>.</td></tr>
                <tr><td>Dropzone keyboard</td><td><code className="i">role=&quot;button&quot;</code> + <code className="i">tabIndex={"{0}"}</code> + Enter/Space handler.</td></tr>
                <tr><td>Slider labels</td><td><code className="i">&lt;label htmlFor&gt;</code> visually hidden (<code className="i">.srOnly</code>) but linked.</td></tr>
                <tr><td>ARIA labels</td><td>Buttons with terse text get descriptive <code className="i">aria-label</code>. Frame image alt is <em>&quot;{"{name}"} preview for {"{label}"}&quot;</em>.</td></tr>
                <tr><td>:focus-visible</td><td>3px cyan outline on every focusable element. <code className="i">:focus</code> without <code className="i">:focus-visible</code> stays outline-less so mouse users aren&apos;t annoyed.</td></tr>
                <tr><td>Reduced motion</td><td><code className="i">@media (prefers-reduced-motion: reduce)</code> kills all animations and transitions.</td></tr>
                <tr><td>Color contrast</td><td>All text passes WCAG AA (4.5:1 normal, 3:1 large). YT was nudged from #ff0000 to #db0000 and FB from #1877f2 to #166fe5 to clear the threshold.</td></tr>
              </tbody>
            </table>
            <div className="wk-warn">
              <span className="tag">TRADE-OFF</span>
              A11y is often postponed in prototypes. Here it was done from the start: it pays off when the app already has a minimal stable structure, and adds much less overhead than retrofitting it later.
            </div>
          </section>

          <section id="decisions" className="wk-section">
            <h2 className="s">17 / Decisions and trade-offs</h2>
            <h3>Client-side only</h3>
            <p>+ Real privacy (nothing uploads).<br />+ Zero operating cost.<br />+ Works offline after first load.<br />−No ML smart-crop possible (would require a server or a hefty WASM bundle).<br />−Very large images may saturate mobile RAM.</p>
            <h3>WebP q=92 fixed</h3>
            <p>+ Quality/size sweet spot.<br />−No user control over compression level.</p>
            <h3>Cover crop only (no contain, no stretch)</h3>
            <p>+ The output always fills the frame exactly. No awkward padding.<br />−If the image doesn&apos;t match the preset ratio, parts are lost. That&apos;s by design.</p>
            <h3>Per-preset transform (vs. one global)</h3>
            <p>+ Allows focusing on the face for Instagram and the horizon for YouTube banner.<br />−More state to manage, but it&apos;s confined to the <code className="i">transforms</code> object.</p>
            <h3>Artificial skeleton + fade</h3>
            <p>+ Perceived processing.<br />−Adds 400ms of real waiting. In low-latency contexts a toggle could be exposed.</p>
            <h3>Sequential ZIP</h3>
            <p>+ Doesn&apos;t blow up mobile memory.<br />−Slower than parallel. Acceptable for 23 presets.</p>
            <h3>No backend</h3>
            <p>+ Deploys to static hosting (Vercel free, Netlify, GitHub Pages).<br />−No analytics or telemetry without adding something separate.</p>
            <h3>Brutalism</h3>
            <p>+ Memorable, anti-template, strong identity.<br />−Polarizes. Not for every audience, but that was the point.</p>
          </section>
        </main>
      </div>
    </WalkChrome>
  );
}
