"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Uploader from "@/components/Uploader";
import PresetCard from "@/components/PresetCard";
import { ALL_PRESETS, PLATFORMS, type Platform } from "@/lib/platforms";
import { DEFAULT_TRANSFORM, type Transform } from "@/lib/transform";
import { baseNameOf, buildZip, triggerDownload } from "@/lib/export";
import styles from "./page.module.css";

type LoadedImage = {
  element: HTMLImageElement;
  name: string;
};

export default function Page() {
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const [transforms, setTransforms] = useState<Record<string, Transform>>({});
  const [zipping, setZipping] = useState<string | null>(null);

  const handleZip = useCallback(
    async (key: string, presets: Platform["presets"], suffix: string) => {
      if (!loaded || zipping) return;
      setZipping(key);
      try {
        const blob = await buildZip(loaded.element, loaded.name, presets, transforms);
        triggerDownload(blob, `${baseNameOf(loaded.name)}-${suffix}.zip`);
      } finally {
        setZipping(null);
      }
    },
    [loaded, transforms, zipping],
  );

  const handleImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setLoaded({ element: img, name: file.name });
      setTransforms({});
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  useEffect(() => {
    return () => {
      if (loaded) URL.revokeObjectURL(loaded.element.src);
    };
  }, [loaded]);

  const setTransform = useCallback((id: string, t: Transform) => {
    setTransforms((prev) => ({ ...prev, [id]: t }));
  }, []);

  const reset = useCallback(() => {
    if (loaded) URL.revokeObjectURL(loaded.element.src);
    setLoaded(null);
    setTransforms({});
  }, [loaded]);

  return (
    <>
      <Header active="home" />
      <main id="content" className={styles.main}>
        {!loaded && (
          <section
            className={styles.uploadWrap}
            aria-label="Upload your source image"
          >
            <Uploader onImage={handleImage} />
          </section>
        )}

        {loaded && (
          <>
            <section className={styles.source} aria-labelledby="source-heading">
              <p className={styles.sourceTopline}>
                <span aria-hidden="true">SOURCE.</span>
                <span className={styles.srOnly} id="source-heading">
                  Source image
                </span>
              </p>
              <div className={styles.sourceRow}>
                <div className={styles.sourcePreview}>
                  <img
                    src={loaded.element.src}
                    alt={`Source: ${loaded.name}`}
                    className={styles.sourceImg}
                  />
                </div>
                <div className={styles.sourceMeta}>
                  <h1 className={styles.sourceName}>{loaded.name}</h1>
                  <p
                    className={styles.sourceDims}
                    aria-label={`Dimensions ${loaded.element.naturalWidth} by ${loaded.element.naturalHeight} pixels`}
                  >
                    {loaded.element.naturalWidth} × {loaded.element.naturalHeight} PX
                  </p>
                </div>
                <div className={styles.sourceActions}>
                  <button
                    type="button"
                    className={styles.zipAll}
                    onClick={() => handleZip("all", ALL_PRESETS, "all")}
                    disabled={zipping !== null}
                    aria-label={`Download all ${ALL_PRESETS.length} formats as a ZIP archive`}
                  >
                    {zipping === "all"
                      ? `ZIPPING ${ALL_PRESETS.length}…`
                      : `↓ ZIP ALL (${ALL_PRESETS.length})`}
                  </button>
                  <button
                    type="button"
                    className={styles.swap}
                    onClick={reset}
                    aria-label="Swap source image"
                  >
                    ↺ SWAP
                  </button>
                </div>
              </div>
            </section>

            <aside className={styles.howto} aria-label="How to reframe">
              <span className={styles.howtoGlyph} aria-hidden="true">↔</span>
              <span className={styles.howtoPart}>
                <strong>DRAG</strong> TO PAN
              </span>
              <span className={styles.howtoSep} aria-hidden="true">·</span>
              <span className={styles.howtoGlyph} aria-hidden="true">⇕</span>
              <span className={styles.howtoPart}>
                <strong>SCROLL · SLIDER</strong> TO ZOOM
              </span>
              <span className={styles.howtoSep} aria-hidden="true">·</span>
              <span className={styles.howtoGlyph} aria-hidden="true">↺</span>
              <span className={styles.howtoPart}>
                <strong>RESET</strong> ANY FRAME
              </span>
            </aside>

            {PLATFORMS.map((platform, idx) => {
              const headingId = `${platform.id}-heading`;
              return (
                <section
                  key={platform.id}
                  className={styles.platform}
                  data-platform={platform.id}
                  data-idx={idx % 4}
                  aria-labelledby={headingId}
                >
                  <div className={styles.platformBand}>
                    <h2 id={headingId} className={styles.platformName}>
                      {platform.name.toUpperCase()}.
                    </h2>
                    <span className={styles.platformArrows} aria-hidden="true">
                      →→→
                    </span>
                    <span className={styles.platformCount}>
                      {platform.presets.length} FORMATS
                    </span>
                    <button
                      type="button"
                      className={styles.platformZip}
                      onClick={() =>
                        handleZip(platform.id, platform.presets, platform.id)
                      }
                      disabled={zipping !== null}
                      aria-label={`Download all ${platform.name} formats as a ZIP archive`}
                    >
                      {zipping === platform.id
                        ? "ZIPPING…"
                        : "↓ DOWNLOAD SET"}
                    </button>
                  </div>
                  <div className={styles.grid}>
                    {platform.presets.map((preset) => (
                      <PresetCard
                        key={preset.id}
                        preset={preset}
                        platformColor={platform.color}
                        image={loaded.element}
                        imageName={loaded.name}
                        transform={transforms[preset.id] ?? DEFAULT_TRANSFORM}
                        onTransformChange={(t) => setTransform(preset.id, t)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}

        <footer className={styles.footer}>
          <span>FRAMR. — MADE FOR CONTENT PEOPLE.</span>
          <span>WEBP · Q92 · NO UPLOAD.</span>
        </footer>
      </main>
    </>
  );
}
