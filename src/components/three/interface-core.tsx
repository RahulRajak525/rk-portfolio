"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { createRandom } from "@/lib/random";
import {
  layers,
  MAX_PARTICLES,
  palette,
  pulseAt,
  pulseBoost,
  PULSE_PERIOD,
  tiers,
  type QualityTier,
} from "./config";
import * as glsl from "./shaders";

/**
 * THE INTERFACE CORE
 * ------------------
 * A layered object that maps to how interfaces are built:
 *   nucleus   → state & logic      (the source; emits signal pulses)
 *   lattice   → structure          (components, the wireframe)
 *   shell     → interface          (the faceted surface users touch)
 *   orbits    → interaction/motion (data packets travelling the system)
 *   particles → signal & data      (noise that converges into structure)
 *
 * On load the particle field converges ("signal → structure"); every few
 * seconds the nucleus emits a pulse that propagates outward through each
 * layer in turn. `explode` separates the layers (anatomy view) — the hook
 * for later scroll-driven storytelling.
 */

export type CorePlacement = "hero" | "center";

type InterfaceCoreProps = {
  tier: QualityTier;
  reducedMotion: boolean;
  placement: CorePlacement;
  /** 0 = assembled, 1 = layers separated. */
  explode?: number;
};

const TAU = Math.PI * 2;
const INTRO_SECONDS = 2.8;
/** Pose rendered when motion is reduced: intro complete, comets spread out. */
const STATIC_TIME = 7.3;

const rings = [
  {
    radius: layers.orbits[0],
    rotation: [1.22, 0.18, 0.25],
    color: palette.ion400,
    speed: 0.07,
    dashes: 0,
    dashMix: 0,
    opacity: 0.85,
    offset: 0,
  },
  {
    radius: layers.orbits[1],
    rotation: [1.38, -0.62, 0.35],
    color: palette.plasma400,
    speed: -0.045,
    dashes: 140,
    dashMix: 1,
    opacity: 0.7,
    offset: 0.35,
  },
  {
    radius: layers.orbits[2],
    rotation: [1.02, 0.72, -0.42],
    color: palette.ion300,
    speed: 0.032,
    dashes: 260,
    dashMix: 0.85,
    opacity: 0.5,
    offset: 0.7,
  },
] as const;

/* ---- Geometry (deterministic, built once) ------------------------------ */

function buildGeometries() {
  const latticeSource = new THREE.IcosahedronGeometry(layers.lattice, 1);
  const latticeEdges = new THREE.EdgesGeometry(latticeSource, 1);

  // Unique vertices of the lattice become glowing nodes.
  const source = latticeSource.getAttribute("position");
  const seen = new Set<string>();
  const nodes: number[] = [];
  for (let i = 0; i < source.count; i++) {
    const x = source.getX(i);
    const y = source.getY(i);
    const z = source.getZ(i);
    const key = `${x.toFixed(3)}|${y.toFixed(3)}|${z.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    nodes.push(x, y, z);
  }
  latticeSource.dispose();
  const latticeNodes = new THREE.BufferGeometry();
  latticeNodes.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(nodes, 3),
  );

  // Non-indexed + recomputed normals = flat facets (crystalline look).
  const shell = new THREE.IcosahedronGeometry(layers.shell, 1);
  shell.computeVertexNormals();
  const shellEdges = new THREE.EdgesGeometry(shell, 1);

  const particles = buildParticleField();

  return { latticeEdges, latticeNodes, shell, shellEdges, particles };
}

function buildParticleField() {
  const random = createRandom(20251007);
  const gaussian = () => {
    const u = Math.max(random(), 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * random());
  };

  const data = new Float32Array(MAX_PARTICLES * 4);
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const seed = random();
    if (random() < 0.72) {
      // Accretion disk: dense near the core, thicker toward the edge.
      const r = 2.3 + Math.pow(random(), 1.7) * 5.4;
      data.set([r, random() * TAU, gaussian() * 0.16 * (r / 3), seed], i * 4);
    } else {
      // Sparse spherical halo.
      const radius = 2.6 + random() * 4.8;
      const u = random() * 2 - 1;
      data.set(
        [radius * Math.sqrt(1 - u * u), random() * TAU, radius * u, seed],
        i * 4,
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  // Positions are computed in the vertex shader; the attribute only sizes draws.
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(MAX_PARTICLES * 3), 3),
  );
  geometry.setAttribute("aData", new THREE.BufferAttribute(data, 4));
  return geometry;
}

const color = (hex: string) => new THREE.Color(hex);

function buildUniforms() {
  return {
    lattice: {
      uColor: { value: color(palette.ion300) },
      uOpacity: { value: 0.55 },
      uBoost: { value: 0 },
    },
    nodes: {
      uColor: { value: color(palette.ion200) },
      uSize: { value: 52 },
      uPixelRatio: { value: 1 },
      uBoost: { value: 0 },
    },
    shell: {
      uColorA: { value: color(palette.ion400) },
      uColorB: { value: color(palette.plasma400) },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uBoost: { value: 0 },
    },
    shellEdges: {
      uColor: { value: color(palette.plasma300) },
      uOpacity: { value: 0.12 },
      uBoost: { value: 0 },
    },
    nucleus: {
      uCore: { value: color(palette.white) },
      uEdge: { value: color(palette.ion400) },
      uEnergy: { value: 0 },
    },
    glow: {
      uColor: { value: color(palette.ion400) },
      uIntensity: { value: 0.55 },
    },
    particles: {
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uSpread: { value: 1 },
      uSize: { value: 24 },
      uPixelRatio: { value: 1 },
      uPulseRadius: { value: 0 },
      uPulseStrength: { value: 0 },
      uColorA: { value: color(palette.ion300) },
      uColorB: { value: color(palette.plasma300) },
      uColorC: { value: color(palette.white) },
    },
    rings: rings.map((ring) => ({
      uColor: { value: color(ring.color) },
      uHead: { value: ring.offset },
      uDirection: { value: Math.sign(ring.speed) },
      uDashes: { value: ring.dashes },
      uDashMix: { value: ring.dashMix },
      uOpacity: { value: ring.opacity },
      uBoost: { value: 0 },
    })),
  };
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const damp = THREE.MathUtils.damp;

/* ---- Scene -------------------------------------------------------------- */

export function InterfaceCore({
  tier,
  reducedMotion,
  placement,
  explode = 0,
}: InterfaceCoreProps) {
  const viewport = useThree((state) => state.viewport);
  const invalidate = useThree((state) => state.invalidate);

  const geometries = useMemo(() => buildGeometries(), []);
  const uniforms = useMemo(() => buildUniforms(), []);

  const root = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const lattice = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Group>(null);
  const orbits = useRef<THREE.Group>(null);
  const nucleus = useRef<THREE.Mesh>(null);
  const particles = useRef<THREE.Points>(null);
  const satellites = useRef<(THREE.Mesh | null)[]>([]);
  const materials = useRef<Record<string, THREE.ShaderMaterial | null>>({});
  const clock = useRef({ t: 0, intro: 0, explode: 0 });
  const pointer = useRef({ x: 0, y: 0 });

  // Geometries passed as props are not owned by R3F — dispose them here.
  useEffect(
    () => () =>
      Object.values(geometries).forEach((geometry) => geometry.dispose()),
    [geometries],
  );

  // Draw only as many particles as the quality tier allows.
  useEffect(() => {
    geometries.particles.setDrawRange(0, tiers[tier].particles);
    invalidate();
  }, [geometries, tier, invalidate]);

  // Re-render the static pose when inputs change in on-demand mode.
  useEffect(() => invalidate(), [explode, placement, invalidate]);

  // Pointer parallax: fine pointers only, never under reduced motion.
  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  // Responsive composition: beside the copy on wide screens, above it on
  // tall ones.
  const aspect = viewport.width / viewport.height;
  const layout =
    placement === "center"
      ? {
          x: 0,
          y: 0,
          scale: Math.min(1, viewport.height / 6.4, viewport.width / 6.4),
        }
      : aspect > 1.15
        ? {
            x: viewport.width * 0.22,
            y: 0.05,
            scale: THREE.MathUtils.clamp(viewport.height / 7.2, 0.7, 1.1),
          }
        : {
            x: 0,
            y: viewport.height * 0.21,
            scale: THREE.MathUtils.clamp(viewport.width / 6.6, 0.48, 0.8),
          };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const c = clock.current;
    if (reducedMotion) {
      c.t = STATIC_TIME;
      c.intro = 1;
      c.explode = explode;
    } else {
      c.t += dt;
      c.intro = Math.min(1, c.intro + dt / INTRO_SECONDS);
      c.explode = damp(c.explode, explode, 3.5, dt);
    }

    const t = c.t;
    const intro = easeOutCubic(c.intro);
    const e = c.explode;
    const pixelRatio = state.gl.getPixelRatio();
    const m = materials.current;

    // Parallax tilt toward the pointer + intro scale.
    if (tilt.current) {
      tilt.current.rotation.x = damp(
        tilt.current.rotation.x,
        pointer.current.y * 0.16,
        2.5,
        dt,
      );
      tilt.current.rotation.y = damp(
        tilt.current.rotation.y,
        pointer.current.x * 0.24,
        2.5,
        dt,
      );
      tilt.current.scale.setScalar(0.86 + 0.14 * intro);
    }

    // Idle rotation — each layer at its own tempo.
    const spin = reducedMotion ? 0 : dt;
    if (lattice.current) {
      lattice.current.rotation.y += spin * 0.12;
      lattice.current.rotation.x += spin * 0.035;
      lattice.current.scale.setScalar(1 + e * 0.35);
    }
    if (shell.current) {
      shell.current.rotation.y -= spin * 0.05;
      shell.current.scale.setScalar(1 + e * 0.95);
    }
    if (orbits.current) {
      orbits.current.rotation.y += spin * 0.02;
      orbits.current.scale.setScalar(1 + e * 0.6);
    }

    // Signal pulse from the nucleus.
    const pulse = pulseAt(t);
    const energy = Math.exp(-(t % PULSE_PERIOD) * 3);
    if (nucleus.current) nucleus.current.scale.setScalar(1 + energy * 0.08);
    if (m.nucleus) m.nucleus.uniforms.uEnergy!.value = energy;
    if (m.glow)
      m.glow.uniforms.uIntensity!.value = (0.45 + energy * 0.35) * intro;

    const latticeBoost = pulseBoost(t, layers.lattice * (1 + e * 0.35));
    if (m.lattice) {
      m.lattice.uniforms.uBoost!.value = latticeBoost;
      m.lattice.uniforms.uOpacity!.value = 0.55 * intro;
    }
    if (m.nodes) {
      m.nodes.uniforms.uBoost!.value = latticeBoost;
      m.nodes.uniforms.uPixelRatio!.value = pixelRatio;
    }

    const shellBoost = pulseBoost(t, layers.shell * (1 + e * 0.95));
    if (m.shell) {
      m.shell.uniforms.uTime!.value = t;
      m.shell.uniforms.uBoost!.value = shellBoost;
      m.shell.uniforms.uOpacity!.value = intro;
    }
    if (m.shellEdges) m.shellEdges.uniforms.uBoost!.value = shellBoost;

    rings.forEach((ring, i) => {
      const head = (((t * ring.speed + ring.offset) % 1) + 1) % 1;
      const material = m[`ring${i}`];
      if (material) {
        material.uniforms.uHead!.value = head;
        material.uniforms.uBoost!.value = pulseBoost(
          t,
          ring.radius * (1 + e * 0.6),
        );
        material.uniforms.uOpacity!.value = ring.opacity * intro;
      }
      const satellite = satellites.current[i];
      if (satellite) {
        satellite.position.set(
          Math.cos(head * TAU) * ring.radius,
          Math.sin(head * TAU) * ring.radius,
          0,
        );
        satellite.visible = intro > 0.5;
      }
    });

    if (m.particles) {
      const u = m.particles.uniforms;
      u.uTime!.value = t;
      u.uIntro!.value = intro;
      u.uSpread!.value = 1 + e * 0.22;
      u.uPixelRatio!.value = pixelRatio;
      u.uPulseRadius!.value = pulse.radius;
      u.uPulseStrength!.value = pulse.strength * 0.8;
    }
  });

  const additive = {
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  } as const;

  return (
    <group ref={root} position={[layout.x, layout.y, 0]} scale={layout.scale}>
      {/* Glow stays camera-facing: it lives outside the tilting group. */}
      <mesh renderOrder={-1}>
        <planeGeometry args={[4.4, 4.4]} />
        <shaderMaterial
          ref={(material) => {
            materials.current.glow = material;
          }}
          uniforms={uniforms.glow}
          vertexShader={glsl.glowVertex}
          fragmentShader={glsl.glowFragment}
          {...additive}
        />
      </mesh>

      <group ref={tilt}>
        <mesh ref={nucleus}>
          <icosahedronGeometry args={[layers.nucleus, 4]} />
          <shaderMaterial
            ref={(material) => {
              materials.current.nucleus = material;
            }}
            uniforms={uniforms.nucleus}
            vertexShader={glsl.shellVertex}
            fragmentShader={glsl.nucleusFragment}
          />
        </mesh>

        <group ref={lattice}>
          <lineSegments geometry={geometries.latticeEdges}>
            <shaderMaterial
              ref={(material) => {
                materials.current.lattice = material;
              }}
              uniforms={uniforms.lattice}
              vertexShader={glsl.facingVertex}
              fragmentShader={glsl.lineFragment}
              {...additive}
            />
          </lineSegments>
          <points geometry={geometries.latticeNodes}>
            <shaderMaterial
              ref={(material) => {
                materials.current.nodes = material;
              }}
              uniforms={uniforms.nodes}
              vertexShader={glsl.nodeVertex}
              fragmentShader={glsl.nodeFragment}
              {...additive}
            />
          </points>
        </group>

        <group ref={shell} rotation={[0.3, 0, 0.12]}>
          <mesh geometry={geometries.shell}>
            <shaderMaterial
              ref={(material) => {
                materials.current.shell = material;
              }}
              uniforms={uniforms.shell}
              vertexShader={glsl.shellVertex}
              fragmentShader={glsl.shellFragment}
              side={THREE.DoubleSide}
              {...additive}
            />
          </mesh>
          <lineSegments geometry={geometries.shellEdges}>
            <shaderMaterial
              ref={(material) => {
                materials.current.shellEdges = material;
              }}
              uniforms={uniforms.shellEdges}
              vertexShader={glsl.facingVertex}
              fragmentShader={glsl.lineFragment}
              {...additive}
            />
          </lineSegments>
        </group>

        <group ref={orbits}>
          {rings.map((ring, i) => (
            <group
              key={ring.radius}
              rotation={ring.rotation as unknown as [number, number, number]}
            >
              <mesh>
                <torusGeometry args={[ring.radius, 0.0055, 6, 360]} />
                <shaderMaterial
                  ref={(material) => {
                    materials.current[`ring${i}`] = material;
                  }}
                  uniforms={uniforms.rings[i]}
                  vertexShader={glsl.orbitVertex}
                  fragmentShader={glsl.orbitFragment}
                  {...additive}
                />
              </mesh>
              <mesh
                ref={(mesh) => {
                  satellites.current[i] = mesh;
                }}
              >
                <sphereGeometry args={[0.032, 12, 12]} />
                <meshBasicMaterial color={palette.white} toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>

        <points
          ref={particles}
          geometry={geometries.particles}
          frustumCulled={false}
          rotation={[-0.32, 0, 0.16]}
        >
          <shaderMaterial
            ref={(material) => {
              materials.current.particles = material;
            }}
            uniforms={uniforms.particles}
            vertexShader={glsl.particleVertex}
            fragmentShader={glsl.particleFragment}
            {...additive}
          />
        </points>
      </group>
    </group>
  );
}
