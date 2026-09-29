import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1240px" },
    },
    extend: {
      colors: {
        // Page ground and layered surfaces (dark charcoal / navy).
        // Named "ink" rather than "base" so it can't collide with the text-base font size.
        ink: {
          DEFAULT: "#0B0F19",
          deep: "#070A12",
        },
        surface: {
          DEFAULT: "#111726",
          raised: "#161D2F",
          hover: "#1B2438",
        },
        edge: {
          DEFAULT: "#1F2A3D",
          strong: "#2B3850",
        },
        // Typography
        fg: {
          DEFAULT: "#F8FAFC",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
        // Brand accent (cyber green)
        cyber: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          DEFAULT: "#10B981",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          950: "#022C22",
        },
        // Inquiry priority levels
        severity: {
          low: "#38BDF8",
          medium: "#FBBF24",
          high: "#FB923C",
          critical: "#F43F5E",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(to right, rgb(148 163 184 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.06) 1px, transparent 1px)",
        "cyber-glow":
          "radial-gradient(ellipse at top, rgb(16 185 129 / 0.18), transparent 60%)",
      },
      backgroundSize: {
        grid: "44px 44px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(16 185 129 / 0.35), 0 10px 40px -10px rgb(16 185 129 / 0.45)",
        "glow-sm": "0 0 0 1px rgb(16 185 129 / 0.25), 0 4px 20px -6px rgb(16 185 129 / 0.35)",
        panel: "0 24px 60px -20px rgb(0 0 0 / 0.65)",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "drawer-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "ping-slow": {
          "75%, 100%": { transform: "scale(1.8)", opacity: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        "toast-in": "toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "sheet-up": "sheet-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "drawer-in": "drawer-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pop-in": "pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        "ping-slow": "ping-slow 2.2s cubic-bezier(0, 0, 0.2, 1) infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
