import { education } from "@/content/about";
import { timeline } from "@/content/experience";
import { person, status } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";

/**
 * schema.org Person + WebSite. Emitted only once real content is published
 * (status !== "draft") so placeholders never reach structured data.
 */
export function PersonJsonLd() {
  if (status === "draft") return null;

  const url = getSiteUrl().toString();
  const current = timeline.find((entry) => entry.current);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${url}#person`,
        name: person.name,
        jobTitle: person.role,
        url,
        ...(person.email ? { email: `mailto:${person.email}` } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ghaziabad",
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },
        ...(current
          ? {
              worksFor: { "@type": "Organization", name: current.organization },
            }
          : {}),
        alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
        knowsAbout: person.coreStack,
        sameAs: person.socials.map((social) => social.href),
      },
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name: person.name,
        publisher: { "@id": `${url}#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so no string in the payload can close the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
