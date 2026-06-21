import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
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

