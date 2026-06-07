import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // The gallery pages read photo files at build time (via lib/photos.ts) only
  // to measure dimensions. Next's file tracer would otherwise bundle the whole
  // ~560MB public/images folder into the serverless function, blowing past
  // Vercel's 300MB limit. The pages are statically prerendered and the images
  // are served straight from the CDN, so the function never needs the bytes —
  // exclude them from the trace.
  outputFileTracingExcludes: {
    "/**/*": ["public/images/**/*"],
    "*": ["public/images/**/*"],
  },
};

export default nextConfig;
