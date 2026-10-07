import type { MetadataRoute } from "next";
import { person, seo } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.title,
    short_name: person.name,
    description: seo.description,
    start_url: "/",
    display: "browser",
    background_color: "#04060b",
    theme_color: "#04060b",
    icons: [{ src: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
  };
}
