import { Hero } from "@/components/sections/hero/hero";
import { Experience } from "@/components/sections/experience/experience";
import { Projects } from "@/components/sections/projects/projects";
import { Capabilities } from "@/components/sections/capabilities/capabilities";
import { About } from "@/components/sections/about/about";
import { Contact } from "@/components/sections/contact/contact";
import { PersonJsonLd } from "@/components/seo/json-ld";

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <Hero />
      <Experience />
      <Projects />
      <Capabilities />
      <About />
      <Contact />
    </>
  );
}
