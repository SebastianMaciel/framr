export type Transform = {
  zoom: number;
  cx: number;
  cy: number;
};

export const DEFAULT_TRANSFORM: Transform = { zoom: 1, cx: 0.5, cy: 0.5 };

export type FrameMath = {
  scale: number;
  renderedW: number;
  renderedH: number;
  tx: number;
  ty: number;
};

export function computeFrame(
  imgW: number,
  imgH: number,
  frameW: number,
  frameH: number,
  t: Transform,
): FrameMath {
  const base = Math.max(frameW / imgW, frameH / imgH);
  const scale = base * t.zoom;
  const renderedW = imgW * scale;
  const renderedH = imgH * scale;

  let tx = frameW / 2 - t.cx * renderedW;
  let ty = frameH / 2 - t.cy * renderedH;

  const minTx = frameW - renderedW;
  const minTy = frameH - renderedH;
  if (tx > 0) tx = 0;
  if (ty > 0) ty = 0;
  if (tx < minTx) tx = minTx;
  if (ty < minTy) ty = minTy;

  return { scale, renderedW, renderedH, tx, ty };
}

export function clampedTransform(
  imgW: number,
  imgH: number,
  frameW: number,
  frameH: number,
  t: Transform,
): Transform {
  const zoom = Math.max(1, Math.min(8, t.zoom));
  const base = Math.max(frameW / imgW, frameH / imgH);
  const scale = base * zoom;
  const renderedW = imgW * scale;
  const renderedH = imgH * scale;

  const halfFrameXInImg = (frameW / 2) / renderedW;
  const halfFrameYInImg = (frameH / 2) / renderedH;

  const cx = Math.min(1 - halfFrameXInImg, Math.max(halfFrameXInImg, t.cx));
  const cy = Math.min(1 - halfFrameYInImg, Math.max(halfFrameYInImg, t.cy));

  return { zoom, cx, cy };
}
