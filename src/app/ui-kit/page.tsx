import Link from "next/link";
import Header from "@/components/Header";
import { PLATFORMS } from "@/lib/platforms";
import styles from "./page.module.css";

export const metadata = {
  title: "FRAMR. — UI Kit",
  description: "The brutalist design system behind framr.",
};

const TOKENS = [
  { name: "Paper", hex: "#FFFFFF", role: "BG · CANVAS" },
  { name: "Ink", hex: "#000000", role: "TEXT · BORDERS" },
  { name: "Yellow", hex: "#FFF200", role: "PRIMARY ACTION" },
  { name: "Magenta", hex: "#FF0066", role: "WARNINGS · UPSCALE" },
  { name: "Cyan", hex: "#00E0FF", role: "SECONDARY ACTION · ZIP ALL" },
  { name: "Red", hex: "#FF2200", role: "YOUTUBE BRAND" },
  { name: "Lime", hex: "#C4FF00", role: "RESERVE" },
];

const BRAND_VALUES: Record<string, string> = {
  instagram: "GRADIENT · #F58529 → #DD2A7B → #8134AF → #515BD4",
  tiktok: "#000000 · NAME #25F4EE · ARROWS #FE2C55",
  youtube: "#FF0000",
  x: "#000000 · TEXT #FFFFFF",
  linkedin: "#0A66C2",
  facebook: "#1877F2",
};

export default function UIKit() {
  return (
    <>
      <Header active="ui-kit" />
      <main id="content" className={styles.main}>
        <section className={styles.intro} aria-labelledby="brutalism-heading">
        <p className={styles.kicker}>00 / WHAT IS THIS?</p>
        <h1 id="brutalism-heading" className={styles.h1}>
          WEB
          <br />
          BRUTALISM.
        </h1>
        <p className={styles.lede}>HONEST. LOUD. ANTI-TEMPLATE.</p>
        <p className={styles.body}>
          Born from 1950s architecture — raw concrete, structure exposed, no
          ornament. On the web it means thick black borders, saturated colors,
          harsh contrast, chunky type, hover states that <em>thunk</em>.
          Anti-elegance. Anti-glassmorphism. Anti-AI-template. The components
          below are everything framr is built from.
        </p>
      </section>

      <section className={styles.section} id="palette">
        <div className={styles.sectionHead}>
          <div className={styles.kicker}>01 / PALETTE</div>
          <h2 className={styles.h2}>COLORS.</h2>
        </div>
        <div className={styles.swatches}>
          {TOKENS.map((t) => (
            <div key={t.name} className={styles.swatch}>
              <div className={styles.swatchChip} style={{ background: t.hex }} />
              <div className={styles.swatchInfo}>
                <div className={styles.swatchName}>{t.name.toUpperCase()}</div>
                <div className={styles.swatchHex}>{t.hex}</div>
                <div className={styles.swatchRole}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} id="type">
        <div className={styles.sectionHead}>
          <div className={styles.kicker}>02 / TYPE</div>
          <h2 className={styles.h2}>TYPESETTING.</h2>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.typeLabel}>SPACE GROTESK · 700 · DISPLAY</span>
          <div className={styles.typeBig}>FRAMR.</div>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.typeLabel}>SPACE GROTESK · 700 · H2</span>
          <div className={styles.typeMid}>INSTAGRAM. →→→</div>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.typeLabel}>SPACE GROTESK · 400 · BODY</span>
          <div className={styles.typeBody}>
            The quick brown fox jumps over the lazy dog. 0123456789
          </div>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.typeLabel}>JETBRAINS MONO · 700 · TAG</span>
          <div className={styles.typeMono}>IG_FEED_PORTRAIT 1080×1350</div>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.typeLabel}>JETBRAINS MONO · 500 · META</span>
          <div className={styles.typeMonoMeta}>
            WEBP · Q92 · NO UPLOAD. STAYS IN YOUR BROWSER.
          </div>
        </div>
      </section>

      <section className={styles.section} id="buttons">
        <div className={styles.sectionHead}>
          <div className={styles.kicker}>03 / BUTTONS</div>
          <h2 className={styles.h2}>BUTTONS.</h2>
        </div>
        <div className={styles.btnGrid}>
          <div className={styles.btnCell}>
            <button className={`${styles.btn} ${styles.btnYellow}`}>↺ SWAP</button>
            <div className={styles.btnLabel}>PRIMARY · YELLOW</div>
          </div>
          <div className={styles.btnCell}>
            <button className={`${styles.btn} ${styles.btnCyan}`}>↓ ZIP ALL (23)</button>
            <div className={styles.btnLabel}>SECONDARY · CYAN</div>
          </div>
          <div className={styles.btnCell}>
            <button className={`${styles.btn} ${styles.btnInkFull}`}>↓ GIMME .WEBP</button>
            <div className={styles.btnLabel}>SOLID · INK</div>
          </div>
          <div className={styles.btnCell}>
            <button className={`${styles.btn} ${styles.btnMagenta}`}>
              ↓ GIMME (UPSCALED +28%)
            </button>
            <div className={styles.btnLabel}>WARNING · MAGENTA</div>
          </div>
          <div className={styles.btnCell}>
            <button className={`${styles.btn} ${styles.btnInk}`}>↓ DOWNLOAD SET</button>
            <div className={styles.btnLabel}>BAND · INK</div>
          </div>
          <div className={styles.btnCell}>
            <button className={`${styles.btn} ${styles.btnGhost}`}>↺ RESET</button>
            <div className={styles.btnLabel}>GHOST · TEXT-ONLY</div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="controls">
        <div className={styles.sectionHead}>
          <div className={styles.kicker}>04 / CONTROLS</div>
          <h2 className={styles.h2}>SLIDER.</h2>
        </div>
        <div className={styles.sliderRow}>
          <input
            type="range"
            min={1}
            max={4}
            defaultValue={1.5}
            step={0.01}
            className={styles.slider}
            aria-label="Demo slider"
          />
          <span className={styles.sliderLabel}>ZOOM · 1.0 → 4.0</span>
        </div>
      </section>

      <section className={styles.section} id="states">
        <div className={styles.sectionHead}>
          <div className={styles.kicker}>05 / FRAME STATES</div>
          <h2 className={styles.h2}>FRAMES.</h2>
        </div>
        <div className={styles.framesRow}>
          <div className={styles.frameDemo}>
            <div className={styles.frame}>
              <div className={styles.frameSkeleton} />
            </div>
            <div className={styles.frameCaption}>01 · SKELETON (400MS)</div>
          </div>
          <div className={styles.frameDemo}>
            <div className={styles.frame}>
              <div className={styles.frameLoaded} />
            </div>
            <div className={styles.frameCaption}>02 · LOADED</div>
          </div>
          <div className={styles.frameDemo}>
            <div className={styles.frame}>
              <div className={styles.frameLoaded} />
              <div className={styles.upscaleBadge}>⚠ +28%</div>
            </div>
            <div className={styles.frameCaption}>03 · UPSCALE WARN</div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="bands">
        <div className={styles.sectionHead}>
          <div className={styles.kicker}>06 / PLATFORM BANDS</div>
          <h2 className={styles.h2}>BANDS.</h2>
        </div>
        <div className={styles.bands}>
          {PLATFORMS.map((p) => (
            <div key={p.id} className={styles.bandItem}>
              <div className={styles.band} data-platform={p.id}>
                <span className={styles.bandName}>{p.name.toUpperCase()}.</span>
                <span className={styles.bandArrows}>→→→</span>
                <span className={styles.bandCount}>{p.presets.length} FORMATS</span>
                <span className={styles.bandZip}>↓ DOWNLOAD SET</span>
              </div>
              <div className={styles.bandCaption}>{BRAND_VALUES[p.id]}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} id="principles">
        <div className={styles.sectionHead}>
          <div className={styles.kicker}>07 / RULES</div>
          <h2 className={styles.h2}>PRINCIPLES.</h2>
        </div>
        <ol className={styles.principles}>
          <li>SHARP CORNERS ONLY. NO BORDER-RADIUS.</li>
          <li>3PX BLACK BORDERS EVERYWHERE.</li>
          <li>HOVER STATES THUNK. 4PX SOLID SHADOW, NO BLUR.</li>
          <li>COPY IS CONFRONTATIONAL AND MOSTLY UPPERCASE.</li>
          <li>SATURATED PALETTE OVER SUBTLETY.</li>
          <li>BRAND COLORS MATCH OFFICIAL OR INVERT FOR CONTRAST.</li>
          <li>WARNING ≠ BLOCKER. SHOW THE COST, LET THE USER CHOOSE.</li>
        </ol>
      </section>

        <footer className={styles.footer}>
          <Link href="/" className={styles.footerBack}>
            ← BACK TO FRAMR.
          </Link>
          <span>UI KIT · V0.1</span>
        </footer>
      </main>
    </>
  );
}
