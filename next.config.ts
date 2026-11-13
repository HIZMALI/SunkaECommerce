import type { NextConfig } from "next";
const config: NextConfig = {
  agentRules: false,
  devIndicators: false,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
};
export default config;
