import JSZip from "jszip";
import type { Preset } from "./platforms";
import { DEFAULT_TRANSFORM, type Transform, computeFrame } from "./transform";

export async function renderPresetToBlob(
  image: HTMLImageElement,
  preset: Preset,
  transform: Transform,
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = preset.width;
  canvas.height = preset.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const m = computeFrame(
    image.naturalWidth,
    image.naturalHeight,
    preset.width,
    preset.height,
    transform,
  );
  ctx.drawImage(image, m.tx, m.ty, m.renderedW, m.renderedH);

  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/webp", 0.92),
  );
}

export function fileNameFor(imageName: string, preset: Preset): string {
  const base = imageName.replace(/\.[^.]+$/, "");
  return `${base}-${preset.id}.webp`;
}

export function baseNameOf(imageName: string): string {
  return imageName.replace(/\.[^.]+$/, "");
}

export async function buildZip(
  image: HTMLImageElement,
  imageName: string,
  presets: Preset[],
  transforms: Record<string, Transform>,
): Promise<Blob> {
  const zip = new JSZip();
  for (const preset of presets) {
    const blob = await renderPresetToBlob(
      image,
      preset,
      transforms[preset.id] ?? DEFAULT_TRANSFORM,
    );
    if (blob) zip.file(fileNameFor(imageName, preset), blob);
  }
  return zip.generateAsync({ type: "blob" });
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
