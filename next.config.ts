import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.aladin.co.kr",
      },
      {
        protocol: "https",
        hostname: "checkmo-s3-presigned.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
