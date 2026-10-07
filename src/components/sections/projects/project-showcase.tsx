"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import * as m from "motion/react-m";
import type { CaseStudy } from "@/content/types";
import { ease, popVariants, stagger } from "@/lib/motion";
import { scrollToElement } from "@/components/motion/smooth-scroll";
import { Badge } from "@/components/ui/badge";
import { HudCorners } from "@/components/ui/panel";
import { InViewFlag } from "@/components/motion/in-view-flag";
import { CaseVisual } from "./case-visual";

/**
 * Scroll-driven case studies. Chapters (server-rendered, fully readable)
 * scroll on the left; a sticky stage on the right shows the chapter in
 * focus and morphs between projects. The stage is a visual mirror — the
 * chapters carry all content, so nothing is hidden behind interaction.
 */
export function ProjectShowcase({
  projects,
  children,
}: {
  projects: readonly CaseStudy[];
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // The chapter crossing the middle band of the viewport is "in focus".
  useEffect(() => {
    const chapters = Array.from(
      ref.current?.querySelectorAll<HTMLElement>("[data-chapter]") ?? [],
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = chapters.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  // Mirror focus into the DOM so CSS can emphasise the active chapter.
  useEffect(() => {
    ref.current
      ?.querySelectorAll<HTMLElement>("[data-chapter]")
      .forEach((chapter, i) => {
        chapter.dataset.active = String(i === active);
      });
  }, [active]);

  const jump = (index: number) => {
    const chapter =
      ref.current?.querySelectorAll<HTMLElement>("[data-chapter]")[index];
    if (chapter) scrollToElement(chapter);
  };

  const project = projects[active] ?? projects[0];

  return (
    <div
      ref={ref}
      className="mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-grid"
    >
      <div className="space-y-20 lg:col-span-6 lg:space-y-0">{children}</div>
      {project ? (
        <div className="hidden lg:col-span-6 lg:block">
          <InViewFlag className="sticky top-[calc(var(--header-h)+2.5rem)]">
            <Stage
              projects={projects}
              project={project}
              index={active}
              onJump={jump}
            />
          </InViewFlag>
        </div>
      ) : null}
    </div>
  );
}

const tilt = { stiffness: 150, damping: 18, mass: 0.6 };

function Stage({
  projects,
  project,
  index,
  onJump,
}: {
  projects: readonly CaseStudy[];
  project: CaseStudy;
  index: number;
  onJump: (index: number) => void;
}) {
  const reducedMotion = useReducedMotion();
  const rotateX = useSpring(0, tilt);
  const rotateY = useSpring(0, tilt);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(20);
  const glare = useMotionTemplate`radial-gradient(32rem circle at ${glareX}% ${glareY}%, oklch(1 0 0 / 0.07), transparent 62%)`;
  const number = String(index + 1).padStart(2, "0");

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    rotateY.set((nx - 0.5) * 11);
    rotateX.set((0.5 - ny) * 8);
    glareX.set(nx * 100);
    glareY.set(ny * 100);
  };
  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className="[perspective:1600px]">
      <m.div
        aria-hidden="true"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-xl border border-line bg-surface-solid/90 p-6 shadow-lift"
      >
        <div className="absolute inset-0 rounded-[inherit] bg-grid opacity-50 [--grid-size:1.5rem]" />
        <HudCorners className="[transform:translateZ(36px)]" />

        <div
          className="relative flex items-center justify-between type-label text-fg-faint"
          style={{ transform: "translateZ(24px)" }}
        >
          <span className="flex items-baseline gap-1.5">
            <span className="relative inline-flex overflow-hidden text-accent tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <m.span
                  key={number}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5, ease: ease.outExpo }}
                  className="inline-block"
                >
                  P{number}
                </m.span>
              </AnimatePresence>
            </span>
            / {String(projects.length).padStart(2, "0")}
          </span>
          <span>{project.kind}</span>
        </div>

        <div
          className="relative mt-6 aspect-[320/170]"
          style={{ transform: "translateZ(64px)" }}
        >
          <AnimatePresence initial={false}>
            <m.div
              key={project.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: ease.outExpo }}
            >
              <CaseVisual kind={project.visual} flow="inview" />
            </m.div>
          </AnimatePresence>
        </div>

        <div
          className="relative mt-6 min-h-16"
          style={{ transform: "translateZ(40px)" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: ease.outQuart }}
            >
              <p className="text-heading-md text-fg">{project.title}</p>
              <p className="mt-1 type-label text-fg-subtle">
                {project.metric ? (
                  <>
                    <span className="text-accent">{project.metric.value}</span>{" "}
                    {project.metric.label}
                  </>
                ) : (
                  project.role
                )}
              </p>
            </m.div>
          </AnimatePresence>
        </div>

        <m.ul
          key={project.id}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: stagger.tight } },
          }}
          style={{ z: 28 }}
          className="relative mt-5 flex min-h-18 flex-wrap content-start gap-1.5"
        >
          {project.stack.map((tech) => (
            <m.li key={tech} variants={popVariants}>
              <Badge>{tech}</Badge>
            </m.li>
          ))}
        </m.ul>

        <m.div
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
        />
      </m.div>

      <nav aria-label="Projects" className="mt-5 flex gap-2">
        {projects.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onJump(i)}
            aria-current={i === index ? "true" : undefined}
            className="group/seg relative h-9 flex-1 rounded-sm"
          >
            <span className="sr-only">
              Project {i + 1}: {item.title}
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-line transition-colors group-hover/seg:bg-line-strong"
            >
              <span className="block h-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-aria-current/seg:scale-x-100" />
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
