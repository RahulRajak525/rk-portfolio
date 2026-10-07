import type { MetadataRoute } from "next";
import { status } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules:
      status === "draft"
        ? { userAgent: "*", disallow: "/" }
        : { userAgent: "*", allow: "/", disallow: "/system" },
    sitemap: new URL("/sitemap.xml", base).toString(),
  };
}
