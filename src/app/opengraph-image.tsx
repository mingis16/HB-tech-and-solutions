import { ImageResponse } from "next/og";

// Shared-link preview (WhatsApp, LinkedIn, X, Facebook...) for every page.
export const alt = "HB Tech Solutions: software engineering, cybersecurity & AI automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(ellipse at top, #0f3d2e 0%, #0B0F19 60%)",
          color: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 16,
              border: "2px solid rgba(16,185,129,0.5)",
              background: "rgba(16,185,129,0.12)",
              color: "#10B981",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            {">_"}
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>HB Tech Solutions</div>
          <div style={{ display: "flex", fontSize: 26, color: "#64748B" }}>/ initialize</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
          <div style={{ display: "flex" }}>Elite software.</div>
          <div style={{ display: "flex", color: "#10B981" }}>Hardened security.</div>
          <div style={{ display: "flex" }}>Automation that scales.</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#94A3B8" }}>
          <div style={{ display: "flex" }}>Web &amp; Apps · Penetration Testing · AI Workflows</div>
          <div style={{ display: "flex", color: "#10B981" }}>Freetown, Sierra Leone</div>
        </div>
      </div>
    ),
    size,
  );
}
