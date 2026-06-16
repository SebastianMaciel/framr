"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Preset } from "@/lib/platforms";
import { getCoverScale } from "@/lib/platforms";
import { type Transform, computeFrame, clampedTransform } from "@/lib/transform";
import { renderPresetToBlob, fileNameFor, triggerDownload } from "@/lib/export";
import styles from "./PresetCard.module.css";

type Props = {
  preset: Preset;
  platformColor: string;
  image: HTMLImageElement;
  imageName: string;
  transform: Transform;
  onTransformChange: (t: Transform) => void;
};

const MAX_DISPLAY = 240;

function getDisplay(preset: Preset) {
  const aspect = preset.width / preset.height;
  if (aspect >= 1) {
    return { w: MAX_DISPLAY, h: Math.round(MAX_DISPLAY / aspect) };
  }
  return { w: Math.round(MAX_DISPLAY * aspect), h: MAX_DISPLAY };
}

export default function PresetCard({
  preset,
  platformColor,
  image,
  imageName,
  transform,
  onTransformChange,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startCx: number;
    startCy: number;
    scale: number;
  } | null>(null);
  const [exporting, setExporting] = useState(false);

  const display = useMemo(() => getDisplay(preset), [preset]);
  const coverScale = getCoverScale(
    image.naturalWidth,
    image.naturalHeight,
    preset.width,
    preset.height,
  );
  const upscalePct = Math.round((coverScale - 1) * 100);
  const fits = coverScale <= 1;
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    setSkeleton(true);
    const id = setTimeout(() => setSkeleton(false), 400);
    return () => clearTimeout(id);
  }, [image.src]);

  const math = useMemo(
    () =>
      computeFrame(
        image.naturalWidth,
        image.naturalHeight,
        display.w,
        display.h,
        transform,
      ),
    [image.naturalWidth, image.naturalHeight, display.w, display.h, transform],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startCx: transform.cx,
        startCy: transform.cy,
        scale: math.scale,
      };
    },
    [transform.cx, transform.cy, math.scale],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      const cx = d.startCx - dx / (image.naturalWidth * d.scale);
      const cy = d.startCy - dy / (image.naturalHeight * d.scale);
      onTransformChange(
        clampedTransform(
          image.naturalWidth,
          image.naturalHeight,
          display.w,
          display.h,
          { zoom: transform.zoom, cx, cy },
        ),
      );
    },
    [
      image.naturalWidth,
      image.naturalHeight,
      display.w,
      display.h,
      transform.zoom,
      onTransformChange,
    ],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.002;
      const zoom = transform.zoom * (1 + delta);
      onTransformChange(
        clampedTransform(
          image.naturalWidth,
          image.naturalHeight,
          display.w,
          display.h,
          { zoom, cx: transform.cx, cy: transform.cy },
        ),
      );
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [
    transform,
    image.naturalWidth,
    image.naturalHeight,
    display.w,
    display.h,
    onTransformChange,
  ]);

  const onZoomSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const zoom = parseFloat(e.target.value);
      onTransformChange(
        clampedTransform(
          image.naturalWidth,
          image.naturalHeight,
          display.w,
          display.h,
          { zoom, cx: transform.cx, cy: transform.cy },
        ),
      );
    },
    [
      image.naturalWidth,
      image.naturalHeight,
      display.w,
      display.h,
      transform.cx,
      transform.cy,
      onTransformChange,
    ],
  );

  const onReset = useCallback(() => {
    onTransformChange({ zoom: 1, cx: 0.5, cy: 0.5 });
  }, [onTransformChange]);

  const onDownload = useCallback(async () => {
    setExporting(true);
    try {
      const blob = await renderPresetToBlob(image, preset, transform);
      if (!blob) return;
      triggerDownload(blob, fileNameFor(imageName, preset));
    } finally {
      setExporting(false);
    }
  }, [preset, image, imageName, transform]);

  const headingId = `${preset.id}-heading`;
  const zoomId = `${preset.id}-zoom`;

  return (
    <article
      className={styles.card}
      aria-labelledby={headingId}
    >
      <header className={styles.head}>
        <h3 id={headingId} className={styles.label}>
          <span
            className={styles.dot}
            style={{ background: platformColor }}
            aria-hidden="true"
          />
          {preset.label}
        </h3>
        <span className={styles.meta} aria-label={`Output ${preset.width} by ${preset.height} pixels`}>
          {preset.width}×{preset.height}
        </span>
      </header>

      <div className={styles.frameWrap} style={{ height: MAX_DISPLAY }}>
        <div
          ref={frameRef}
          role="group"
          aria-label={`${preset.label} crop area. Drag to pan, scroll to zoom.`}
          className={styles.frame}
          style={{ width: display.w, height: display.h }}
          onPointerDown={!skeleton ? onPointerDown : undefined}
          onPointerMove={!skeleton ? onPointerMove : undefined}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          data-skeleton={skeleton}
        >
          {skeleton && (
            <div
              className={styles.skeleton}
              role="status"
              aria-label="Loading preview"
            />
          )}
          <img
            src={image.src}
            alt={skeleton ? "" : `${imageName} preview for ${preset.label}`}
            draggable={false}
            className={styles.img}
            data-ready={!skeleton}
            style={{
              width: math.renderedW,
              height: math.renderedH,
              transform: `translate(${math.tx}px, ${math.ty}px)`,
            }}
          />
          {!fits && !skeleton && (
            <span
              className={styles.upscaleBadge}
              aria-label={`Warning: image will be upscaled ${upscalePct} percent`}
            >
              <span aria-hidden="true">⚠ </span>+{upscalePct}%
            </span>
          )}
          {!skeleton && (
            <span className={styles.frameHint} aria-hidden="true">
              ↔ DRAG · ⇕ ZOOM
            </span>
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <label htmlFor={zoomId} className={styles.srOnly}>
          Zoom for {preset.label}
        </label>
        <input
          id={zoomId}
          type="range"
          min={1}
          max={4}
          step={0.01}
          value={transform.zoom}
          onChange={onZoomSlider}
          className={styles.slider}
        />
        <button
          type="button"
          className={styles.reset}
          onClick={onReset}
          aria-label={`Reset zoom and position for ${preset.label}`}
        >
          ↺ RESET
        </button>
      </div>

      <button
        type="button"
        className={styles.download}
        onClick={onDownload}
        disabled={exporting}
        data-fits={fits}
        aria-label={
          fits
            ? `Download ${preset.label} as WebP`
            : `Download ${preset.label} as WebP. Will be upscaled ${upscalePct} percent.`
        }
      >
        {exporting
          ? "ENCODING…"
          : fits
            ? "↓ GIMME .WEBP"
            : `↓ GIMME (UPSCALED +${upscalePct}%)`}
      </button>
    </article>
  );
}
