import type { NextConfig } from "next";

const development = process.env.NODE_ENV !== 'production'

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Ensure we can import the local server package from server components without bundling it
  serverExternalPackages: [
    "@ms-smtp/common",
    "@ms-smtp/lib",
    "@ms-smtp/server"
  ],
  typescript: {
    tsconfigPath: (development ? "./tsconfig.json" : "./tsconfig.build.json")
  }
};

export default nextConfig;
