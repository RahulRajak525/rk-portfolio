/* GLSL for the Interface Core. Every fragment shader ends with
   <colorspace_fragment> so linear-space uniforms render as the intended sRGB
   token colours. All motion is computed on the GPU from uTime. */

/* ---- Facing-based depth cue shared by line/point layers ---------------- */
export const facingVertex = /* glsl */ `
  varying float vFacing;
  void main() {
    vec3 dir = normalize(position);
    vFacing = normalize(normalMatrix * dir).z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const lineFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uBoost;
  varying float vFacing;
  void main() {
    float depth = mix(0.16, 1.0, smoothstep(-0.9, 0.9, vFacing));
    float alpha = uOpacity * depth * (1.0 + uBoost * 1.8);
    gl_FragColor = vec4(uColor * (1.0 + uBoost * 1.2), alpha);
    #include <colorspace_fragment>
  }
`;

/* ---- Lattice nodes (glowing vertices) ---------------------------------- */
export const nodeVertex = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uBoost;
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = normalize(normalMatrix * normalize(position)).z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (1.0 + uBoost * 0.9) / -mv.z;
  }
`;

export const nodeFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uBoost;
  varying float vFacing;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.8);
    float depth = mix(0.2, 1.0, smoothstep(-0.9, 0.9, vFacing));
    gl_FragColor = vec4(uColor * (1.2 + uBoost), a * depth);
    #include <colorspace_fragment>
  }
`;

/* ---- Shell: faceted holographic glass ---------------------------------- */
export const shellVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vLocal;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vLocal = position;
    gl_Position = projectionMatrix * mv;
  }
`;

export const shellFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uBoost;
  uniform vec3 uLight;        // view-space direction, follows the pointer
  uniform float uLightAmount;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vLocal;
  void main() {
    vec3 n = normalize(vNormal);
    float fresnel = pow(1.0 - abs(dot(n, normalize(vView))), 2.2);
    float scanY = sin(uTime * 0.42) * 1.7;
    float band = exp(-pow((vLocal.y - scanY) * 3.2, 2.0));
    // Flat facets + a narrow lobe = glints that travel across the crystal.
    float glint = pow(max(dot(n, normalize(uLight)), 0.0), 14.0) * uLightAmount;
    vec3 color = mix(uColorA, uColorB, clamp(vLocal.y * 0.3 + 0.5, 0.0, 1.0));
    float alpha = (0.025 + fresnel * 0.38 + band * 0.08 + uBoost * 0.2 + glint * 0.3) * uOpacity;
    gl_FragColor = vec4(color * (0.55 + fresnel * 0.9 + band * 0.5) + uColorA * glint * 1.3, alpha);
    #include <colorspace_fragment>
  }
`;

/* ---- Nucleus ------------------------------------------------------------ */
export const nucleusFragment = /* glsl */ `
  uniform vec3 uCore;
  uniform vec3 uEdge;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vLocal;
  void main() {
    float facing = clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);
    vec3 color = mix(uEdge, uCore, pow(facing, 2.5)) * (0.9 + uEnergy * 0.5);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

/* ---- Additive glow billboard ------------------------------------------- */
export const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(max(0.0, 1.0 - d), 2.6) * uIntensity;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

/* ---- Orbit rings: dashes + a travelling "data packet" comet ------------ */
export const orbitVertex = /* glsl */ `
  varying float vT;
  varying float vFacing;
  void main() {
    vT = uv.x;
    vFacing = normalize(normalMatrix * normalize(position)).z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const orbitFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uHead;
  uniform float uDirection;
  uniform float uDashes;
  uniform float uDashMix;
  uniform float uOpacity;
  uniform float uBoost;
  varying float vT;
  varying float vFacing;
  void main() {
    float behind = fract((uHead - vT) * uDirection);
    float comet = pow(1.0 - behind, 22.0);
    float dash = step(0.45, fract(vT * uDashes));
    float base = mix(1.0, dash, uDashMix) * 0.32;
    float depth = mix(0.22, 1.0, smoothstep(-0.9, 0.9, vFacing));
    float alpha = (base + comet * 1.8 + uBoost * 0.35) * depth * uOpacity;
    gl_FragColor = vec4(uColor * (1.0 + comet * 1.6), alpha);
    #include <colorspace_fragment>
  }
`;

/* ---- Particle field: the "signal" that converges into structure -------- */
export const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uSpread;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uPulseRadius;
  uniform float uPulseStrength;
  attribute vec4 aData;   // x: cylindrical radius, y: start angle, z: height, w: seed
  varying float vAlpha;
  varying float vSeed;
  varying float vBoost;
  void main() {
    float r = aData.x;
    float seed = aData.w;
    float radius3 = length(vec2(r, aData.z));
    float theta = aData.y + uTime * (0.1 / sqrt(max(r, 1.4)));
    float spread = mix(2.4, 1.0, uIntro) * uSpread;
    vec3 p = vec3(cos(theta) * r, aData.z, sin(theta) * r) * spread;
    p.y += sin(uTime * 0.55 + seed * 6.2831) * 0.05;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float wave = exp(-pow((radius3 - uPulseRadius) * 1.4, 2.0)) * uPulseStrength;
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.7 + seed * 2.3) + seed * 40.0);
    float scale = 0.45 + fract(seed * 13.7) * 1.15 + step(0.97, seed) * 1.4;

    gl_PointSize = uSize * scale * uPixelRatio * (1.0 + wave * 0.9) / -mv.z;
    vAlpha = twinkle * smoothstep(0.0, 0.6, uIntro) * smoothstep(8.0, 4.5, radius3);
    vSeed = seed;
    vBoost = wave;
  }
`;

export const particleFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying float vAlpha;
  varying float vSeed;
  varying float vBoost;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.6) * vAlpha;
    vec3 color = mix(uColorA, uColorB, step(0.62, vSeed));
    color = mix(color, uColorC, step(0.93, vSeed));
    gl_FragColor = vec4(color * (1.0 + vBoost * 1.4), a);
    #include <colorspace_fragment>
  }
`;

/* ---- Meteor tail: a camera-facing ribbon that burns out along its length */
export const meteorTailVertex = /* glsl */ `
  attribute float aProgress; // 0 at the head → 1 at the tail end
  attribute float aSide;     // -1 / +1 across the ribbon
  varying float vProgress;
  varying float vSide;
  void main() {
    vProgress = aProgress;
    vSide = aSide;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const meteorTailFragment = /* glsl */ `
  uniform vec3 uHot;
  uniform vec3 uMid;
  uniform vec3 uCool;
  uniform float uTime;
  uniform float uOpacity;
  varying float vProgress;
  varying float vSide;
  void main() {
    float core = pow(1.0 - abs(vSide), 1.4);
    float flicker = 0.8 + 0.2 * sin(uTime * 38.0 + vProgress * 26.0);
    vec3 color = mix(uHot, uMid, smoothstep(0.0, 0.3, vProgress));
    color = mix(color, uCool, smoothstep(0.3, 0.9, vProgress));
    float alpha = core * pow(1.0 - vProgress, 1.5) * flicker * uOpacity;
    gl_FragColor = vec4(color * (1.0 + core * 0.8), alpha);
    #include <colorspace_fragment>
  }
`;

/* ---- Meteor blast: sparks with drag + gravity, cooling as they age ----- */
export const sparkVertex = /* glsl */ `
  uniform float uAge;
  uniform float uSpin;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec4 aSpark; // xy: unit direction, z: launch speed, w: seed
  varying float vLife;
  void main() {
    float c = cos(uSpin);
    float s = sin(uSpin);
    vec2 dir = mat2(c, -s, s, c) * aSpark.xy;
    float drag = 3.2;
    float travel = aSpark.z * (1.0 - exp(-drag * uAge)) / drag;
    vec3 p = vec3(dir * travel, (aSpark.w - 0.5) * travel * 0.6);
    p.y -= 0.35 * uAge * uAge;
    float life = clamp(uAge / (0.9 + aSpark.w * 0.9), 0.0, 1.0);
    vLife = life;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aSpark.w) * (1.0 - life) * uPixelRatio / -mv.z;
  }
`;

export const sparkFragment = /* glsl */ `
  uniform vec3 uHot;
  uniform vec3 uMid;
  uniform vec3 uCool;
  varying float vLife;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.5) * (1.0 - vLife);
    vec3 color = mix(uHot, uMid, smoothstep(0.0, 0.35, vLife));
    color = mix(color, uCool, smoothstep(0.35, 1.0, vLife));
    gl_FragColor = vec4(color * 2.0, a);
    #include <colorspace_fragment>
  }
`;

/* ---- Meteor blast: expanding shockwave ring on a quad ------------------ */
export const shockwaveFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uProgress;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float ring = exp(-pow((d - uProgress) * 9.0, 2.0));
    float alpha = ring * pow(1.0 - uProgress, 1.2) * 1.6;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`;
