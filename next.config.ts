import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  env: {
    DATABASE_URL:
      process.env.NODE_ENV === "production"
        ? process.env.DATABASE_URL_INTERNAL
        : process.env.DATABASE_URL_EXTERNAL,
  },
  images: {
    remotePatterns: [
      {
        hostname:
          process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(
            "https://",
            ""
          ).replace("http://", "") || "grien3.s3.eu-central-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
