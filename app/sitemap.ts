import type { MetadataRoute } from "next";

const BASE_URL = "https://adamzvulun.com";

// The site is five static routes. Galleries change most often (new photos
// dropped in via the NN-prefix flow), the home page next, contact rarely —
// reflected in the changeFrequency/priority hints below. `lastModified` uses
// build time, which is exactly when content last changed for a statically
// prerendered site.
const ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/architecture", changeFrequency: "monthly", priority: 0.8 },
  { path: "/portraits", changeFrequency: "monthly", priority: 0.8 },
  { path: "/wildlife", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
