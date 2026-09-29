import { ImageResponse } from "next/og";

// iOS home-screen icon (Safari ignores SVG favicons for this).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0F19",
          color: "#10B981",
          fontSize: 84,
          fontWeight: 700,
        }}
      >
        {">_"}
      </div>
    ),
    size,
  );
}
