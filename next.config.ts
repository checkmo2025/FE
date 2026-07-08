import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.aladin.co.kr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "chekcmo-s3.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  // 약관 페이지를 버전 경로(/support/v1/*)로 이동. 기존 색인/외부 링크 보존용 301 리다이렉트.
  async redirects() {
    return [
      { source: "/terms", destination: "/support/v1/terms", permanent: true },
      { source: "/privacy", destination: "/support/v1/privacy", permanent: true },
      { source: "/third-party-consent", destination: "/support/v1/third-party-consent", permanent: true },
      { source: "/marketing-consent", destination: "/support/v1/marketing-consent", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
      {
        source: "/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};



export default withSentryConfig(nextConfig, {
  org: "checkmo",
  project: "checkmo-next",
  silent: true,
  widenClientFileUpload: true,
  sourcemaps: {
    disable: false,
  },
});
