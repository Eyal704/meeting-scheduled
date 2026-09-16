import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  basePath: process.env.NEXT_PUBLIC_PORTFOLIO_BASE_PATH || "",
  ...(process.env.PORTFOLIO_STATIC_EXPORT === "1"
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  async headers() {
    if (process.env.PORTFOLIO_STATIC_EXPORT === "1") return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },
};

// Static hosts provide their own response headers.
if (process.env.PORTFOLIO_STATIC_EXPORT === "1") delete config.headers;

export default config;
