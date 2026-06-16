import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          color: "#fff200",
          fontSize: 24,
          fontWeight: 900,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          letterSpacing: "-0.08em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 1,
        }}
      >
        F.
      </div>
    ),
    { ...size }
  );
}
