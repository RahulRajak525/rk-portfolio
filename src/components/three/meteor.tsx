"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createRandom } from "@/lib/random";
import { palette } from "./config";
import * as glsl from "./shaders";

/**
 * METEOR — a cursor-following ember with a burning tail (hero, desktop only).
 *
 * The head eases toward the cursor; the tail is a chain where every link
 * eases toward the one ahead of it, so its length is proportional to speed:
 * a fast flick leaves a long trail, a resting cursor leaves only the ember.
 *
 * Lifecycle: alive → (cursor idle) charging → blast → dead → (cursor moves)
 * re-ignites at the cursor. Hidden for touch input, narrow screens, outside
 * the hero, and fades out as soon as the page scrolls.
 */

const SEGMENTS = 36;
/** World z: just in front of the core so it can fly across it. */
const DEPTH = 1.5;
/** Damping rates (1/s): head → cursor, tail link → link ahead. */
const HEAD_FOLLOW = 14;
const TAIL_FOLLOW = 40;
const TAIL_WIDTH = 0.15;
/** Scroll distance (fraction of viewport height) over which it fades out. */
const SCROLL_FADE = 0.25;
/** Cursor idle time before the ember detonates, and its wind-up before it. */
const IDLE_BLAST_MS = 5000;
const CHARGE_MS = 600;
const BLAST_SECONDS = 1.8;
const SPARKS = 64;

const TAU = Math.PI * 2;
const damp = THREE.MathUtils.damp;
const clamp = THREE.MathUtils.clamp;
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const DESKTOP_POINTER =
  "(hover: hover) and (pointer: fine) and (min-width: 64rem)";

function buildRibbon() {
  const progress = new Float32Array(SEGMENTS * 2);
  const side = new Float32Array(SEGMENTS * 2);
  const index: number[] = [];
  for (let i = 0; i < SEGMENTS; i++) {
    const t = i / (SEGMENTS - 1);
    progress.set([t, t], i * 2);
    side.set([-1, 1], i * 2);
    if (i < SEGMENTS - 1) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const position = new THREE.BufferAttribute(
    new Float32Array(SEGMENTS * 2 * 3),
    3,
  );
  position.setUsage(THREE.DynamicDrawUsage);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", position);
  geometry.setAttribute("aProgress", new THREE.BufferAttribute(progress, 1));
  geometry.setAttribute("aSide", new THREE.BufferAttribute(side, 1));
  geometry.setIndex(index);
  return geometry;
}

/** Spark directions/speeds are fixed; each blast rotates them (uSpin). */
function buildSparks() {
  const random = createRandom(4242);
  const data = new Float32Array(SPARKS * 4);
  for (let i = 0; i < SPARKS; i++) {
    const angle = (i / SPARKS) * TAU + (random() - 0.5) * 0.35;
    data.set(
      [Math.cos(angle), Math.sin(angle), 1.6 + random() * 3.4, random()],
      i * 4,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(SPARKS * 3), 3),
  );
  geometry.setAttribute("aSpark", new THREE.BufferAttribute(data, 4));
  return geometry;
}

const ember = () => ({
  uHot: { value: new THREE.Color(palette.emberHot) },
  uMid: { value: new THREE.Color(palette.emberMid) },
  uCool: { value: new THREE.Color(palette.emberCool) },
});

export function Meteor() {
  const ribbon = useMemo(() => buildRibbon(), []);
  const sparks = useMemo(() => buildSparks(), []);
  const uniforms = useMemo(
    () => ({
      tail: { ...ember(), uTime: { value: 0 }, uOpacity: { value: 0 } },
      glow: {
        uColor: { value: new THREE.Color(palette.emberMid) },
        uIntensity: { value: 0 },
      },
      sparks: {
        ...ember(),
        uAge: { value: 0 },
        uSpin: { value: 0 },
        uSize: { value: 140 },
        uPixelRatio: { value: 1 },
      },
      flash: {
        uColor: { value: new THREE.Color(palette.emberHot) },
        uIntensity: { value: 0 },
      },
      shock: {
        uColor: { value: new THREE.Color(palette.emberMid) },
        uProgress: { value: 0 },
      },
    }),
    [],
  );

  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);
  const burst = useRef<THREE.Group>(null);
  const tailMaterial = useRef<THREE.ShaderMaterial>(null);
  const glowMaterial = useRef<THREE.ShaderMaterial>(null);
  const coreMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const sparkMaterial = useRef<THREE.ShaderMaterial>(null);
  const flashMaterial = useRef<THREE.ShaderMaterial>(null);
  const shockMaterial = useRef<THREE.ShaderMaterial>(null);
  const cursor = useRef({ x: 0, y: 0, active: false, lastMove: 0 });
  const sim = useRef({
    time: 0,
    opacity: 0,
    phase: "alive" as "alive" | "dead",
    blastAt: 0,
    /** Seconds since the last blast; < 0 when no blast is playing. */
    burstAge: -1,
    points: null as Float32Array | null,
    normal: { x: 0, y: 1 },
    world: new THREE.Vector3(),
  });

  useEffect(
    () => () => {
      ribbon.dispose();
      sparks.dispose();
    },
    [ribbon, sparks],
  );

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_POINTER);
    const onMove = (event: PointerEvent) => {
      const c = cursor.current;
      c.active = event.pointerType === "mouse" && desktop.matches;
      c.x = event.clientX;
      c.y = event.clientY;
      c.lastMove = performance.now();
    };
    // relatedTarget === null: the pointer left the window.
    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) cursor.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const s = sim.current;
    const c = cursor.current;
    const now = performance.now();
    const idle = now - c.lastMove;
    s.time += dt;

    // Moving again after a blast re-ignites the meteor.
    if (s.phase === "dead" && c.lastMove > s.blastAt) s.phase = "alive";

    // Visibility: alive, cursor active, inside the hero, page near the top.
    const rect = state.gl.domElement.getBoundingClientRect();
    const inHero = c.y >= rect.top && c.y <= rect.bottom;
    const scrollFade =
      1 - clamp(window.scrollY / (window.innerHeight * SCROLL_FADE), 0, 1);
    const target = s.phase === "alive" && c.active && inHero ? scrollFade : 0;
    const wasVisible = s.opacity > 0.01;
    s.opacity = damp(s.opacity, target, 9, dt);

    // Cursor → world position on the meteor's plane.
    const view = state.viewport.getCurrentViewport(
      state.camera,
      s.world.set(0, 0, DEPTH),
    );
    const tx = ((c.x - rect.left) / rect.width - 0.5) * view.width;
    const ty = -((c.y - rect.top) / rect.height - 0.5) * view.height;

    // (Re)ignite at the cursor so it never streaks in from a stale position.
    let p = s.points;
    if (!p || !wasVisible) {
      p = s.points ??= new Float32Array(SEGMENTS * 2);
      for (let i = 0; i < SEGMENTS; i++) p.set([tx, ty], i * 2);
    }

    p[0] = damp(p[0]!, tx, HEAD_FOLLOW, dt);
    p[1] = damp(p[1]!, ty, HEAD_FOLLOW, dt);
    for (let i = 1; i < SEGMENTS; i++) {
      p[i * 2] = damp(p[i * 2]!, p[(i - 1) * 2]!, TAIL_FOLLOW, dt);
      p[i * 2 + 1] = damp(p[i * 2 + 1]!, p[(i - 1) * 2 + 1]!, TAIL_FOLLOW, dt);
    }

    // Idle too long: detonate where the ember rests.
    if (s.phase === "alive" && s.opacity > 0.5 && idle > IDLE_BLAST_MS) {
      s.phase = "dead";
      s.blastAt = now;
      s.opacity = 0;
      s.burstAge = 0;
      burst.current?.position.set(p[0]!, p[1]!, DEPTH);
      if (sparkMaterial.current)
        sparkMaterial.current.uniforms.uSpin!.value = Math.random() * TAU;
    }

    // Blast playback — independent of the meteor's own visibility.
    if (s.burstAge >= 0) {
      s.burstAge += dt;
      const age = s.burstAge;
      if (sparkMaterial.current) {
        const u = sparkMaterial.current.uniforms;
        u.uAge!.value = age;
        u.uPixelRatio!.value = state.gl.getPixelRatio();
      }
      if (flashMaterial.current)
        flashMaterial.current.uniforms.uIntensity!.value =
          2.6 * Math.exp(-age * 4.5);
      if (shockMaterial.current)
        shockMaterial.current.uniforms.uProgress!.value = easeOutCubic(
          Math.min(age / 1.0, 1),
        );
      if (age > BLAST_SECONDS) s.burstAge = -1;
    }
    if (burst.current) burst.current.visible = s.burstAge >= 0;

    if (group.current) group.current.visible = s.opacity > 0.01;
    if (s.opacity <= 0.01) return;

    // Rebuild the ribbon: offset each link perpendicular to the path.
    const position = tail.current?.geometry.getAttribute("position");
    if (position) {
      for (let i = 0; i < SEGMENTS; i++) {
        const ahead = Math.max(i - 1, 0);
        const behind = Math.min(i + 1, SEGMENTS - 1);
        const dx = p[ahead * 2]! - p[behind * 2]!;
        const dy = p[ahead * 2 + 1]! - p[behind * 2 + 1]!;
        const length = Math.hypot(dx, dy);
        if (length > 1e-5) {
          s.normal.x = -dy / length;
          s.normal.y = dx / length;
        }
        const t = i / (SEGMENTS - 1);
        const half = (TAIL_WIDTH * Math.pow(1 - t, 1.3)) / 2;
        const x = p[i * 2]!;
        const y = p[i * 2 + 1]!;
        position.setXYZ(
          i * 2,
          x - s.normal.x * half,
          y - s.normal.y * half,
          DEPTH,
        );
        position.setXYZ(
          i * 2 + 1,
          x + s.normal.x * half,
          y + s.normal.y * half,
          DEPTH,
        );
      }
      position.needsUpdate = true;
    }

    // Wind-up before the blast: the ember swells and flickers harder.
    const charge = clamp(
      (idle - (IDLE_BLAST_MS - CHARGE_MS)) / CHARGE_MS,
      0,
      1,
    );
    const flicker =
      1 -
      0.1 -
      charge * 0.25 +
      (0.1 + charge * 0.25) * Math.sin(s.time * (31 + charge * 50));

    head.current?.position.set(p[0]!, p[1]!, DEPTH);
    head.current?.scale.setScalar(1 + charge * charge * 1.4);

    if (tailMaterial.current) {
      tailMaterial.current.uniforms.uTime!.value = s.time;
      tailMaterial.current.uniforms.uOpacity!.value = s.opacity;
    }
    if (glowMaterial.current)
      glowMaterial.current.uniforms.uIntensity!.value =
        (0.85 + charge * 0.8) * flicker * s.opacity;
    if (coreMaterial.current) coreMaterial.current.opacity = s.opacity;
  });

  const additive = {
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  } as const;

  return (
    <>
      <group ref={group} visible={false}>
        <mesh
          ref={tail}
          geometry={ribbon}
          frustumCulled={false}
          renderOrder={10}
        >
          <shaderMaterial
            ref={tailMaterial}
            uniforms={uniforms.tail}
            vertexShader={glsl.meteorTailVertex}
            fragmentShader={glsl.meteorTailFragment}
            side={THREE.DoubleSide}
            {...additive}
          />
        </mesh>
        <group ref={head}>
          <mesh renderOrder={11}>
            <planeGeometry args={[0.9, 0.9]} />
            <shaderMaterial
              ref={glowMaterial}
              uniforms={uniforms.glow}
              vertexShader={glsl.glowVertex}
              fragmentShader={glsl.glowFragment}
              {...additive}
            />
          </mesh>
          <mesh renderOrder={12}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial
              ref={coreMaterial}
              color={palette.emberHot}
              toneMapped={false}
              {...additive}
            />
          </mesh>
        </group>
      </group>

      {/* Blast: flash + shockwave ring + sparks. */}
      <group ref={burst} visible={false}>
        <mesh renderOrder={13}>
          <planeGeometry args={[2.4, 2.4]} />
          <shaderMaterial
            ref={flashMaterial}
            uniforms={uniforms.flash}
            vertexShader={glsl.glowVertex}
            fragmentShader={glsl.glowFragment}
            {...additive}
          />
        </mesh>
        <mesh renderOrder={13}>
          <planeGeometry args={[3.4, 3.4]} />
          <shaderMaterial
            ref={shockMaterial}
            uniforms={uniforms.shock}
            vertexShader={glsl.glowVertex}
            fragmentShader={glsl.shockwaveFragment}
            {...additive}
          />
        </mesh>
        <points geometry={sparks} frustumCulled={false} renderOrder={14}>
          <shaderMaterial
            ref={sparkMaterial}
            uniforms={uniforms.sparks}
            vertexShader={glsl.sparkVertex}
            fragmentShader={glsl.sparkFragment}
            {...additive}
          />
        </points>
      </group>
    </>
  );
}
