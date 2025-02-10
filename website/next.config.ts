import type { NextConfig } from "next";
import "dotenv/config";

console.log("BFF Base URL:", process.env.NEXT_PUBLIC_BFF_BASE_URL);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BFF_BASE_URL: process.env.NEXT_PUBLIC_BFF_BASE_URL,
  },
};

export default nextConfig;
