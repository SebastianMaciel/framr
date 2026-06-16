import type { Metadata } from "next";
import Link from "next/link";
import "../walkthrough.css";
import WalkChrome from "../WalkChrome";
import WalkDiagram from "../WalkDiagram";
import { Code, Tree } from "../Code";

export const metadata: Metadata = {
  title: "FRAMR.: cómo funciona, por dentro",
  description: "Walkthrough técnico de FRAMR.",
};

export default function WalkthroughES() {
  return (
    <WalkChrome lang="es">
      <section className="wk-hero">
        <p className="wk-kicker">00 / GUÍA DEL CÓDIGO</p>
        <h1 className="wk-h1">
          CÓMO
          <br />
          FUNCIONA
          <br />
          ESTO.
        </h1>
        <p className="wk-lede">
          Lectura técnica de FRAMR. Cada decisión, cada archivo, cada pedacito de mate explicado.
        </p>
        <p>
          Esto no es un README marketinero, es la guía interna del proyecto. Para entender por qué algo está armado como está, está acá. Orden recomendado de lectura: top to bottom, aunque cada sección se sostiene sola.
        </p>
      </section>

      <div className="wk-wrap">
        <nav className="wk-toc" aria-label="Tabla de contenidos">
          <h2>ÍNDICE</h2>
          <ol>
            <li><a href="#vista">Vista de pájaro</a></li>
            <li><a href="#archivos">Mapa de archivos</a></li>
            <li><a href="#catalogo">Catálogo de plataformas</a></li>
            <li><a href="#transform">El modelo de transform</a></li>
            <li><a href="#computeFrame">computeFrame, paso a paso</a></li>
            <li><a href="#state">Estado del page</a></li>
            <li><a href="#uploader">Uploader</a></li>
            <li><a href="#presetcard">PresetCard (el jugoso)</a></li>
            <li><a href="#pan">Pan: cómo se arrastra</a></li>
            <li><a href="#zoom">Zoom: wheel + slider</a></li>
            <li><a href="#skeleton">Skeleton + fade</a></li>
            <li><a href="#fits">El check de upscale</a></li>
            <li><a href="#export">Export a WebP</a></li>
            <li><a href="#zip">Generación de ZIPs</a></li>
            <li><a href="#brutalism">Brutalismo aplicado</a></li>
            <li><a href="#a11y">A11y: qué se hizo y por qué</a></li>
            <li><a href="#decisiones">Decisiones y trade-offs</a></li>
          </ol>
        </nav>

        <main id="content">
          <section id="vista" className="wk-section">
            <h2 className="s">01 / Vista de pájaro</h2>
            <p>
              FRAMR es una <strong>app 100% cliente</strong>. No hay backend, no hay base de datos, no hay subida a ningún servidor. Todo el procesamiento de imágenes ocurre en el browser usando la <code className="i">Canvas API</code>.
            </p>
            <p>El flujo es simple:</p>
            <ol>
              <li>El usuario sube una imagen (drag-drop o file picker).</li>
              <li>El browser la carga en un <code className="i">HTMLImageElement</code> y guarda sus dimensiones.</li>
              <li>Para cada uno de los 23 presets de plataformas, se renderiza un preview interactivo.</li>
              <li>El usuario reposiciona/zoomea cada frame con drag + scroll/slider.</li>
              <li>Cuando descarga, se vuelca a un <code className="i">&lt;canvas&gt;</code> del tamaño exacto del preset, se convierte a WebP con <code className="i">canvas.toBlob()</code>, y se gatilla un download.</li>
              <li>El ZIP se arma con JSZip en el browser, también sin red.</li>
            </ol>

            <WalkDiagram
              labels={{
                ariaLabel: "Flujo de datos",
                image: "IMAGEN",
                catalog: "Catálogo presets",
                catalogSub: "23 formatos · lib/platforms",
                transformsTitle: "Transforms state",
                transformsSub: "zoom · cx · cy por preset",
                presetCardTitle: "PresetCard ×23",
                presetCardSub1: "preview interactivo",
                presetCardSub2: "drag + zoom",
                computeFrameTitle: "computeFrame(): la misma función",
                computeFrameSub: "para el preview Y para el canvas de export",
              }}
            />

            <div className="wk-why">
              <span className="tag">¿POR QUÉ ASÍ?</span>
              La regla más importante: <strong>la imagen original nunca sale del browser</strong>. Es un argumento de privacidad fuerte (no necesita explicaciones para creators) y además ahorra el costo de un backend. Todo lo que necesita Canvas API ya está en el browser hace años.
            </div>
          </section>

          <section id="archivos" className="wk-section">
            <h2 className="s">02 / Mapa de archivos</h2>
            <p>La app es chica, pero todo tiene su lugar:</p>
            <Tree
              html={`src/
├── app/
│   ├── layout.tsx              <span class="com"># fuentes, skip-link, lang="en"</span>
│   ├── globals.css             <span class="com"># tokens, focus-visible, reduced-motion</span>
│   ├── page.tsx                <span class="com"># app principal (Uploader + grid de PresetCards)</span>
│   ├── page.module.css
│   ├── ui-kit/
│   │   ├── page.tsx            <span class="com"># /ui-kit: showcase del design system</span>
│   │   └── page.module.css
│   └── walkthrough/
│       ├── page.tsx            <span class="com"># /walkthrough: este mismo doc (EN)</span>
│       └── es/page.tsx         <span class="com"># /walkthrough/es: versión ES</span>
├── components/
│   ├── Header.tsx              <span class="com"># FRAMR. + WALKTHROUGH + botón UI KIT</span>
│   ├── Header.module.css
│   ├── Uploader.tsx            <span class="com"># drag & drop + picker</span>
│   ├── Uploader.module.css
│   ├── PresetCard.tsx          <span class="com"># preview interactivo + download por preset</span>
│   └── PresetCard.module.css
└── lib/
    ├── platforms.ts            <span class="com"># los 23 presets (Instagram, TikTok, etc.)</span>
    ├── transform.ts            <span class="com"># matemática del crop (zoom·cx·cy → tx·ty·scale)</span>
    └── export.ts               <span class="com"># canvas → WebP → ZIP</span>`}
            />
            <p>Reglas que mantengo en este árbol:</p>
            <ul>
              <li>Componentes en <code className="i">components/</code>, lógica pura en <code className="i">lib/</code>, páginas en <code className="i">app/</code>. Sin <em>utils.ts</em> cajón de sastre.</li>
              <li>Cada componente tiene su <code className="i">.module.css</code> al lado. Sin Tailwind. Cada clase queda scopeada por archivo.</li>
              <li>Nada en <code className="i">lib/</code> importa de <code className="i">components/</code>. Solo en una dirección.</li>
            </ul>
          </section>

          <section id="catalogo" className="wk-section">
            <h2 className="s">03 / Catálogo de plataformas</h2>
            <p>
              Las medidas de cada red social viven hardcodeadas en <code className="i">lib/platforms.ts</code>. Son datos estáticos, oficiales 2026, conseguidos de help centers y blogs de referencia (Buffer, Hootsuite, etc.).
            </p>
            <Code
              lang="typescript"
              code={`export type Preset = {
  id: string;          // "ig_feed_portrait", único
  label: string;       // "Feed Portrait"
  width: number;       // 1080
  height: number;      // 1350
  ratio: string;       // "4:5" (info, no se usa en cálculo)
  minWidth: number;    // 320 (mínimo recomendado por la plataforma)
};

export type Platform = {
  id: string;          // "instagram"
  name: string;        // "Instagram"
  color: string;       // "#E4405F" (legacy, hoy se override en CSS)
  presets: Preset[];
};`}
            />
            <p>Hay 6 plataformas con un total de 23 presets. Algunos ejemplos:</p>
            <table>
              <thead><tr><th>Plataforma</th><th>Preset</th><th>Dim</th><th>Ratio</th></tr></thead>
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
            <p>El archivo también exporta dos helpers chiquitos:</p>
            <Code
              lang="typescript"
              code={`export function getCoverScale(imgW, imgH, presetW, presetH) {
  return Math.max(presetW / imgW, presetH / imgH);
}

export function meetsRequirement(imgW, imgH, preset) {
  return imgW >= preset.width && imgH >= preset.height;
}`}
            />
            <p><code className="i">getCoverScale</code> dice cuánto hay que agrandar la imagen para que cubra completamente un preset. Si da &gt; 1, hay que upscalear (y se pixela). Es la base del warning <code className="i">⚠ +N%</code>.</p>
          </section>

          <section id="transform" className="wk-section">
            <h2 className="s">04 / El modelo de transform</h2>
            <p>Esta es la pieza más importante de todo el proyecto. Acá viven las matemáticas que hacen que el crop sea coherente entre lo que se ve en pantalla y lo que se descarga.</p>
            <h3>El problema</h3>
            <p>Necesitamos representar &quot;cómo está cropeada la imagen en este preset&quot; con un objeto chico, que sea <strong>independiente de las dimensiones del preview</strong>. ¿Por qué? Porque el preview se ve a 240px de display, pero el export se hace a 1080×1920 o 2560×1440. La misma &quot;configuración de crop&quot; tiene que servir para ambos.</p>
            <h3>La solución: 3 números</h3>
            <Code
              lang="typescript"
              code={`export type Transform = {
  zoom: number;  // >= 1, multiplicador encima del "cover fit"
  cx: number;    // 0..1, posición horizontal del centro en coords de imagen
  cy: number;    // 0..1, posición vertical del centro en coords de imagen
};`}
            />
            <p>El truco mental:</p>
            <ul>
              <li><code className="i">zoom = 1</code> significa &quot;la imagen cubre el frame exacto&quot; (cover-fit).</li>
              <li><code className="i">zoom = 2</code> significa &quot;el doble de grande&quot; → vemos menos imagen pero con más detalle.</li>
              <li><code className="i">cx = 0.5, cy = 0.5</code> es el centro de la imagen apuntando al centro del frame.</li>
              <li><code className="i">cx = 0.2</code> es &quot;estoy mirando el 20% horizontal de la imagen&quot;, o sea que el foco se corre a la izquierda.</li>
            </ul>
            <div className="wk-why">
              <span className="tag">¿POR QUÉ NO GUARDAR tx, ty, scale?</span>
              Porque esos valores están atados a un tamaño de frame. Si guardás <code className="i">tx = 120px</code>, eso significa cosas distintas según si el frame es de 240px o de 1080px. Guardando un <strong>punto focal normalizado</strong> (0..1) y un zoom relativo, la misma config funciona para cualquier tamaño de output. Es resolución-independiente.
            </div>
          </section>

          <section id="computeFrame" className="wk-section">
            <h2 className="s">05 / <code className="i">computeFrame()</code>, paso a paso</h2>
            <p>Esta función toma un transform abstracto y un tamaño de frame, y devuelve los valores concretos en píxeles para renderizar.</p>
            <Code
              lang="typescript"
              code={`export function computeFrame(
  imgW, imgH, frameW, frameH, t
) {
  // 1. La escala mínima que asegura cover (que la imagen cubra todo el frame).
  const base = Math.max(frameW / imgW, frameH / imgH);

  // 2. La escala efectiva incluye el zoom del usuario.
  const scale = base * t.zoom;
  const renderedW = imgW * scale;
  const renderedH = imgH * scale;

  // 3. Calculamos tx, ty para que (cx, cy) caiga en el centro del frame.
  let tx = frameW / 2 - t.cx * renderedW;
  let ty = frameH / 2 - t.cy * renderedH;

  // 4. Clamp: la imagen nunca puede dejar un borde vacío.
  const minTx = frameW - renderedW;  // más negativo posible
  const minTy = frameH - renderedH;
  if (tx > 0) tx = 0;
  if (ty > 0) ty = 0;
  if (tx < minTx) tx = minTx;
  if (ty < minTy) ty = minTy;

  return { scale, renderedW, renderedH, tx, ty };
}`}
            />
            <h3>Ejemplo con números reales</h3>
            <p>Imagen 2400×1600, preset 1080×1920 (vertical 9:16), zoom 1, cx 0.5, cy 0.5:</p>
            <ol>
              <li><code className="i">base = max(1080/2400, 1920/1600) = max(0.45, 1.2) = <strong>1.2</strong></code>: la imagen tiene que crecer 20% para cubrir vertical.</li>
              <li><code className="i">scale = 1.2 * 1 = 1.2</code></li>
              <li><code className="i">renderedW = 2400 * 1.2 = 2880</code>, <code className="i">renderedH = 1600 * 1.2 = 1920</code> (justito).</li>
              <li><code className="i">tx = 1080/2 - 0.5 * 2880 = 540 - 1440 = -900</code> (la imagen se mueve a la izquierda).</li>
              <li><code className="i">ty = 1920/2 - 0.5 * 1920 = 960 - 960 = 0</code>.</li>
              <li>El clamp: <code className="i">minTx = 1080 - 2880 = -1800</code>. <code className="i">-900</code> está entre <code className="i">-1800</code> y <code className="i">0</code>, OK.</li>
            </ol>
            <p>Resultado: la imagen se dibuja a tamaño 2880×1920, desplazada 900px a la izquierda, mostrando los 1080 píxeles del centro horizontal y los 1920 verticales. Cover perfecto.</p>
            <h3>El gemelo: <code className="i">clampedTransform()</code></h3>
            <p>Cuando el usuario arrastra o cambia el zoom, el <code className="i">cx</code>/<code className="i">cy</code> resultante puede caer fuera del rango válido (intentando ver más allá del borde). En vez de dejarlo y clampear solo en el render, ajustamos el <code className="i">cx</code>/<code className="i">cy</code> mismos antes de guardar el state. Eso mantiene los valores consistentes.</p>
          </section>

          <section id="state" className="wk-section">
            <h2 className="s">06 / Estado del page</h2>
            <p>Toda la app es un solo componente React (<code className="i">app/page.tsx</code>) con tres bits de estado:</p>
            <Code
              lang="tsx"
              code={`const [loaded, setLoaded] = useState<LoadedImage | null>(null);
const [transforms, setTransforms] = useState<Record<string, Transform>>({});
const [zipping, setZipping] = useState<string | null>(null);`}
            />
            <ul>
              <li><code className="i">loaded</code>: la imagen ya cargada como <code className="i">HTMLImageElement</code> + su nombre. Null cuando todavía no se subió nada.</li>
              <li><code className="i">transforms</code>: un objeto <em>keyed by preset id</em>. Cada preset que el usuario tocó tiene su propio transform; los que no, usan <code className="i">DEFAULT_TRANSFORM</code> ({"{"} zoom: 1, cx: 0.5, cy: 0.5 {"}"}).</li>
              <li><code className="i">zipping</code>: string con qué se está zippeando (&quot;all&quot;, &quot;instagram&quot;, etc.) o null. Sirve para deshabilitar otros botones mientras corre.</li>
            </ul>
            <div className="wk-why">
              <span className="tag">¿POR QUÉ HTMLImageElement Y NO UN BLOB URL?</span>
              Porque necesitamos <code className="i">naturalWidth</code> y <code className="i">naturalHeight</code> mil veces para los cálculos. Tener el elemento ya cargado evita tener que crear y esperar imágenes nuevas en cada render. Además, <code className="i">ctx.drawImage()</code> en el canvas acepta directamente un HTMLImageElement.
            </div>
          </section>

          <section id="uploader" className="wk-section">
            <h2 className="s">07 / Uploader</h2>
            <p>El componente más simple de la app, pero con un par de detalles de a11y.</p>
            <h3>Estructura</h3>
            <p>Un <code className="i">&lt;div&gt;</code> con <code className="i">role=&quot;button&quot;</code> y <code className="i">tabIndex={"{0}"}</code> que actúa como dropzone Y como trigger del file picker:</p>
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
              <span className="tag">¿POR QUÉ NO USAR &lt;button&gt; DIRECTO?</span>
              Por HTML semantics: un <code className="i">&lt;button&gt;</code> no debería tener un <code className="i">&lt;h1&gt;</code> ni un <code className="i">&lt;input&gt;</code> adentro (la spec lo prohíbe). Con un div + role=&quot;button&quot; + tabIndex + manejo de Enter/Space lográs lo mismo accesible sin romper la semantics. Lighthouse lo acepta.
            </div>
            <h3>Validación</h3>
            <p>Cuando llega un archivo, hacemos un check minimal:</p>
            <Code
              lang="typescript"
              code={`if (!file.type.startsWith("image/")) {
  setError("THAT'S NOT AN IMAGE.");
  return;
}`}
            />
            <p>No hay validaciones de tamaño máximo ni nada parecido. Siempre se pueden agregar más validaciones después según necesidad (un check de <code className="i">file.size</code>, formatos específicos, lo que haga falta).</p>
          </section>

          <section id="presetcard" className="wk-section">
            <h2 className="s">08 / PresetCard: el componente jugoso</h2>
            <p>Acá está casi todo el código interactivo. Es el responsable de mostrar el preview de un preset y permitir crop + download.</p>
            <h3>Anatomía</h3>
            <Code
              lang="html"
              code={`<article>                              <!-- card entero, a11y: aria-labelledby -->
  <header>                             <!-- label del preset + dimensiones target -->
    <h3>Feed Portrait</h3>
    <span>1080×1350</span>
  </header>
  <div>                                <!-- frame con overflow:hidden + drag handlers -->
    <img />                            <!-- imagen real, posicionada con transform -->
    <div>skeleton shimmer</div>        <!-- 400ms inicial -->
    <span>⚠ +28%</span>                <!-- badge si necesita upscale -->
    <span>↔ DRAG · ⇕ ZOOM</span>       <!-- hint en hover -->
  </div>
  <div>                                <!-- controles: slider de zoom + reset -->
    <input type="range" />
    <button>RESET</button>
  </div>
  <button>↓ GIMME .WEBP</button>
</article>`}
            />
            <p>El frame muestra el preview a tamaño chico (<code className="i">MAX_DISPLAY = 240px</code> en la dimensión más larga), pero matemáticamente representa el mismo crop que el canvas de export.</p>
          </section>

          <section id="pan" className="wk-section">
            <h2 className="s">09 / Pan: cómo se arrastra</h2>
            <p>El drag usa <strong>Pointer Events</strong> (no mouse events). Pointer events funcionan unificados para mouse + touch + pen, y soportan <code className="i">setPointerCapture()</code> que es clave.</p>
            <h3>El flow</h3>
            <Code
              lang="tsx"
              code={`// onPointerDown
(e) => {
  e.target.setPointerCapture(e.pointerId);  // el target retiene los eventos
  dragRef.current = {
    startX: e.clientX, startY: e.clientY,
    startCx: transform.cx, startCy: transform.cy,
    scale: math.scale,  // la escala efectiva actual
  };
};

// onPointerMove
(e) => {
  const d = dragRef.current;
  if (!d) return;
  const dx = e.clientX - d.startX;
  const dy = e.clientY - d.startY;
  // Convertimos delta en píxeles a delta en coords normalizadas de imagen.
  const cx = d.startCx - dx / (imgW * d.scale);
  const cy = d.startCy - dy / (imgH * d.scale);
  onTransformChange(clampedTransform(/* ... */, { zoom, cx, cy }));
};

// onPointerUp
() => { dragRef.current = null; };`}
            />
            <div className="wk-note">
              <span className="tag">¿POR QUÉ useRef PARA DRAG STATE?</span>
              Porque no necesitamos re-renderizar cuando el drag empieza. Solo necesitamos guardar las posiciones iniciales y leerlas en <code className="i">onPointerMove</code>. Si fuera <code className="i">useState</code>, cada onPointerDown disparaba un re-render inútil. <code className="i">useRef</code> es la forma idiomática de guardar &quot;instance variables&quot; en React.
            </div>
            <div className="wk-why">
              <span className="tag">EL TRUCO DEL setPointerCapture</span>
              Sin pointer capture, si el usuario arrastra rápido y el cursor sale del frame, los <code className="i">onPointerMove</code> dejan de llegar y el drag queda colgado. <code className="i">setPointerCapture</code> hace que el target original siga recibiendo todos los events hasta el <code className="i">pointerup</code>, incluso fuera del element. Drag fluido garantizado.
            </div>
          </section>

          <section id="zoom" className="wk-section">
            <h2 className="s">10 / Zoom: wheel + slider</h2>
            <p>Dos formas de hacer zoom en cada frame.</p>
            <h3>Slider HTML</h3>
            <p>Un <code className="i">&lt;input type=&quot;range&quot; min={"{1}"} max={"{4}"} step={"{0.01}"}&gt;</code>. Trivial. Tiene un <code className="i">&lt;label htmlFor&gt;</code> visualmente oculto pero asociado para screen readers.</p>
            <h3>Wheel listener nativo (no React)</h3>
            <p>Acá hay un truco. React por default registra los listeners de <code className="i">onWheel</code> como <strong>passive</strong>, lo que significa que <code className="i">e.preventDefault()</code> no funciona y el scroll de la página se sigue moviendo. Para evitarlo, registramos el listener vía useEffect con <code className="i">{"{"} passive: false {"}"}</code> directamente al DOM:</p>
            <Code
              lang="tsx"
              code={`useEffect(() => {
  const el = frameRef.current;
  if (!el) return;
  const handler = (e) => {
    e.preventDefault();   // gracias al passive: false
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
              En Mac, la pinch en el trackpad genera <strong>wheel events con ctrlKey</strong>. El handler no chequea ctrlKey y trata cualquier deltaY como zoom, por lo que pinch en trackpad <em>funciona gratis</em>. Para multi-touch pinch en mobile haría falta lógica adicional con dos pointers simultáneos.
            </div>
          </section>

          <section id="skeleton" className="wk-section">
            <h2 className="s">11 / Skeleton + fade: UX deliberada</h2>
            <p>Cuando se carga una imagen nueva, cada PresetCard muestra 400ms de skeleton (rayitas diagonales animadas) y después la imagen aparece con un fade de 320ms.</p>
            <Code
              lang="tsx"
              code={`const [skeleton, setSkeleton] = useState(true);

useEffect(() => {
  setSkeleton(true);                                // reset al cargar una imagen nueva
  const id = setTimeout(() => setSkeleton(false), 400);
  return () => clearTimeout(id);
}, [image.src]);`}
            />
            <div className="wk-why">
              <span className="tag">¿POR QUÉ FORZAR UN DELAY ARTIFICIAL?</span>
              El procesamiento es tan rápido que sin el skeleton parece que no hizo nada. La sensación percibida es importante: 400ms de skeleton + fade genera la sensación de <em>&quot;está procesando&quot;</em>, lo que valida el trabajo a ojos del usuario. Es UX intencional, no un bug.
            </div>
            <p>El fade usa CSS transition en <code className="i">opacity</code>. El skeleton es un <code className="i">background: repeating-linear-gradient</code> con animación <code className="i">@keyframes shimmer</code> que desplaza el patrón a 0.8s/loop.</p>
          </section>

          <section id="fits" className="wk-section">
            <h2 className="s">12 / El check de upscale (warning)</h2>
            <p>Cuando una imagen es más chica que el preset, no la bloqueamos, la dejamos descargable pero con un warning visual.</p>
            <Code
              lang="typescript"
              code={`const coverScale = getCoverScale(imgW, imgH, preset.width, preset.height);
const upscalePct = Math.round((coverScale - 1) * 100);
const fits = coverScale <= 1;`}
            />
            <p>Si <code className="i">coverScale &gt; 1</code>, la imagen necesita ser agrandada para cubrir el preset. Se ve pixelada. Mostramos:</p>
            <ul>
              <li>Un badge <strong>magenta</strong> en la esquina del frame: <code className="i">⚠ +28%</code>.</li>
              <li>El botón download cambia a magenta y dice <code className="i">↓ GIMME (UPSCALED +28%)</code>.</li>
              <li>Igual se puede descargar. El user decide.</li>
            </ul>
          </section>

          <section id="export" className="wk-section">
            <h2 className="s">13 / Export a WebP</h2>
            <p>La función central que convierte un transform en un Blob WebP:</p>
            <Code
              lang="typescript"
              code={`export async function renderPresetToBlob(image, preset, transform) {
  const canvas = document.createElement("canvas");
  canvas.width = preset.width;        // canvas al tamaño exacto del preset
  canvas.height = preset.height;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high"; // mejor remuestreo disponible

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
            <p>La clave: <code className="i">computeFrame()</code> se llama con <strong>las dimensiones del canvas, no del preview</strong>. La misma función produce los valores correctos para cualquier escala, por eso lo que se ve chiquito en pantalla es exactamente lo que termina en el WebP.</p>
            <h3>El download</h3>
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
  URL.revokeObjectURL(url);   // liberar memoria
}`}
            />
            <div className="wk-note">
              <span className="tag">¿POR QUÉ Q=0.92?</span>
              Es el sweet spot del WebP: 92% mantiene la imagen visualmente indistinguible del original pero ahorra ~30% de tamaño vs q=100. Por debajo de 80 ya empiezan a verse artefactos sutiles en fotos con bordes finos.
            </div>
          </section>

          <section id="zip" className="wk-section">
            <h2 className="s">14 / ZIPs en el browser</h2>
            <p>Usamos <strong>JSZip</strong> (única dependencia que no viene con Next.js). Genera ZIPs en memoria sin tocar disco.</p>
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
              <span className="tag">¿POR QUÉ SECUENCIAL Y NO Promise.all?</span>
              Cada <code className="i">toBlob()</code> con canvas grande (2560×1440 por ejemplo) chupa RAM. Hacerlos en paralelo en mobile peta la página. Secuencial es ~1s para los 23 presets en una imagen mediana, aceptable. Y la UI muestra &quot;ZIPPING…&quot; para que se vea que está laburando.
            </div>
            <p>Hay tres puntos de entrada a <code className="i">buildZip</code>:</p>
            <ul>
              <li><strong>ZIP ALL (23)</strong>: botón cyan al lado de SWAP, manda todos los presets.</li>
              <li><strong>DOWNLOAD SET</strong>: un botón por plataforma en su banda, solo manda los presets de esa plataforma.</li>
              <li><strong>Single .webp</strong>: el botón ↓ GIMME de cada card, no usa ZIP, hace un download directo.</li>
            </ul>
          </section>

          <section id="brutalism" className="wk-section">
            <h2 className="s">15 / Brutalismo aplicado</h2>
            <p>Toda la estética sigue 7 reglas, listadas también en <Link href="/ui-kit"><code className="i">/ui-kit</code></Link>:</p>
            <ol>
              <li>Esquinas afiladas. Cero <code className="i">border-radius</code>.</li>
              <li>Bordes negros de 3px en todo lo que tenga frontera.</li>
              <li>Hover hace <em>thunk</em>: <code className="i">translate(-2px, -2px) + box-shadow: 4px 4px 0 color</code>. Sin blur.</li>
              <li>Copy en mayúscula, confrontacional. Punto final como signo.</li>
              <li>Paleta saturada (amarillo, magenta, cyan, rojo). Nunca pastel.</li>
              <li>Brand colors oficiales (con minimal darkening en YT y FB para WCAG).</li>
              <li>Warning no es blocker. Mostrá el costo, dejá decidir.</li>
            </ol>
            <h3>Tokens</h3>
            <p>Definidos en <code className="i">globals.css</code> con CSS custom props:</p>
            <Code
              lang="css"
              code={`:root {
  --paper: #ffffff;
  --ink: #000000;
  --yellow: #fff200;     /* acción primaria */
  --magenta: #ff0066;    /* warnings, upscale */
  --cyan: #00e0ff;       /* acción secundaria (ZIP ALL) */
  --red: #ff2200;
  --lime: #c4ff00;       /* reserva (no se usa) */

  --line-w: 3px;

  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}`}
            />
            <div className="wk-why">
              <span className="tag">¿POR QUÉ CSS MODULES Y NO TAILWIND?</span>
              El brutalism no necesita un design system grande: tokens + Space Grotesk + 4 colores + 3 reglas alcanzan. CSS Modules da scoping por archivo y zero runtime cost. Tailwind sumaría complejidad innecesaria para este alcance.
            </div>
          </section>

          <section id="a11y" className="wk-section">
            <h2 className="s">16 / A11y: qué se hizo y por qué</h2>
            <p>Lighthouse a11y score: <strong>100/100</strong> en <code className="i">/</code> y en <code className="i">/ui-kit</code>. Lista de qué se cubrió:</p>
            <table>
              <thead><tr><th>Categoría</th><th>Qué se hizo</th></tr></thead>
              <tbody>
                <tr><td>Skip link</td><td>Link &quot;Skip to content&quot; al inicio del body, visible solo en focus. Apunta a <code className="i">#content</code> que es el <code className="i">&lt;main&gt;</code>.</td></tr>
                <tr><td>Heading hierarchy</td><td>Un solo <code className="i">&lt;h1&gt;</code> por página. En home: &quot;DROP. AN. IMAGE.&quot; (no-loaded) o el filename (loaded). En /ui-kit: &quot;WEB BRUTALISM.&quot; Después h2 para plataformas y h3 para presets.</td></tr>
                <tr><td>Landmarks</td><td><code className="i">&lt;header&gt;</code>, <code className="i">&lt;nav aria-label=&quot;Primary&quot;&gt;</code>, <code className="i">&lt;main id=&quot;content&quot;&gt;</code>, <code className="i">&lt;section aria-labelledby&gt;</code>, <code className="i">&lt;footer&gt;</code>.</td></tr>
                <tr><td>Dropzone keyboard</td><td><code className="i">role=&quot;button&quot;</code> + <code className="i">tabIndex={"{0}"}</code> + handler de Enter/Space.</td></tr>
                <tr><td>Slider labels</td><td><code className="i">&lt;label htmlFor&gt;</code> visualmente oculto (<code className="i">.srOnly</code>) pero asociado.</td></tr>
                <tr><td>ARIA labels</td><td>Botones con texto chiquito tienen <code className="i">aria-label</code> descriptivo. Imagen del frame tiene alt <em>&quot;{"{name}"} preview for {"{label}"}&quot;</em>.</td></tr>
                <tr><td>:focus-visible</td><td>Outline cyan 3px en todo lo focusable. <code className="i">:focus</code> sin <code className="i">:focus-visible</code> queda sin outline para no joder a usuarios de mouse.</td></tr>
                <tr><td>Reduced motion</td><td><code className="i">@media (prefers-reduced-motion: reduce)</code> anula todas las animaciones y transitions.</td></tr>
                <tr><td>Color contrast</td><td>Todo el texto pasa WCAG AA (4.5:1 normal, 3:1 large). YT bajó de #ff0000 a #db0000 y FB de #1877f2 a #166fe5 para llegar al threshold.</td></tr>
              </tbody>
            </table>
            <div className="wk-warn">
              <span className="tag">TRADE-OFF</span>
              A11y muchas veces se posterga en prototipos. En este caso se hizo desde el principio: vale la pena cuando la app ya tiene una estructura mínima estable, y suma mucho menos overhead que retrofitearla después.
            </div>
          </section>

          <section id="decisiones" className="wk-section">
            <h2 className="s">17 / Decisiones y trade-offs</h2>
            <h3>Client-side only</h3>
            <p>+ Privacidad real (no se sube nada).<br />+ Cero costo operativo.<br />+ Funciona offline después de la primera carga.<br />−Sin posibilidad de smart-crop con ML (requeriría server o WASM gordo).<br />−Imágenes muy grandes pueden saturar RAM mobile.</p>
            <h3>WebP q=92 fijo</h3>
            <p>+ Sweet spot calidad/tamaño.<br />−No le da control al usuario sobre el nivel de compresión.</p>
            <h3>Cover crop only (no contain, no stretch)</h3>
            <p>+ El output siempre cubre el frame exacto. No hay &quot;padding&quot; raro.<br />−Si la imagen no llega al ratio del preset, partes se pierden. Es por diseño.</p>
            <h3>Transform por preset (vs. uno global)</h3>
            <p>+ Permite enfocar la cara para Instagram y el horizonte para YouTube banner.<br />−Más state que mantener, pero está acotado al objeto <code className="i">transforms</code>.</p>
            <h3>Skeleton + fade artificiales</h3>
            <p>+ Sensación percibida de procesamiento.<br />−Suma 400ms de espera real. En contextos low-latency podríamos darle un toggle.</p>
            <h3>ZIP secuencial</h3>
            <p>+ No revienta memoria en mobile.<br />−Algo más lento que en paralelo. Aceptable para 23 presets.</p>
            <h3>No backend</h3>
            <p>+ Deploy a static hosting (Vercel free, Netlify, GitHub Pages).<br />−No analytics ni telemetría sin meter algo aparte.</p>
            <h3>Brutalismo</h3>
            <p>+ Memorable, anti-template, fuerte identidad.<br />−Polariza. No es para todo público, pero ese era el punto.</p>
          </section>
        </main>
      </div>
    </WalkChrome>
  );
}
