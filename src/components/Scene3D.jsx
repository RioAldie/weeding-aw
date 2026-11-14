import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import Lily from './Lily3D.jsx';

const GOLD = '#D4AF37';

/* ------------------------------------------------------------------ */
/* Organic geometry helpers                                            */
/* ------------------------------------------------------------------ */

/**
 * Sculpts a dense plane into a natural leaf / petal:
 *  - lanceolate outline (pointed tip, rounded base)
 *  - V-fold along the midrib
 *  - lengthwise arch + slight sideways twist
 *  - vertex colours: darker midrib, lighter edges (fake translucency)
 */
function sculptBlade({ length = 1.6, width = 0.5, fold = 0.18, arch = 0.35, twist = 0.25, base, edge, rib }) {
  const g = new THREE.PlaneGeometry(1, 1, 14, 32);
  const p = g.attributes.position;
  const colors = [];
  const cBase = new THREE.Color(base), cEdge = new THREE.Color(edge), cRib = new THREE.Color(rib);
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i) * 2; // -1..1 across
    const t = p.getY(i) + 0.5; // 0..1 along
    const outline = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.75)), 0.9);
    const x = u * width * 0.5 * outline;
    let z = Math.abs(u) * fold * outline; // midrib fold
    z += Math.sin(t * Math.PI) * arch * -1 + t * t * arch * 0.6; // arch & tip lift
    z += Math.sin(t * 9 + u * 3) * 0.008; // micro ripple
    const y = t * length;
    // twist around the length axis
    const a = twist * t;
    p.setXYZ(i, x * Math.cos(a) - z * Math.sin(a), y, x * Math.sin(a) + z * Math.cos(a));

    const c = cBase.clone().lerp(cEdge, Math.min(1, Math.abs(u) * 1.1));
    if (Math.abs(u) < 0.08) c.lerp(cRib, 0.7);
    colors.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.translate(0, -length / 2, 0);
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ */
/* Wedding rings: comfort-fit band + solitaire diamond                 */
/* ------------------------------------------------------------------ */

function Band({ radius = 0.8, thickness = 0.07, width = 0.16, color = GOLD, ...props }) {
  // Lathe a rounded "comfort fit" profile around the Y axis
  const geo = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      pts.push(new THREE.Vector2(radius + Math.cos(a) * thickness, Math.sin(a) * width * 0.5 * (1 - 0.15 * Math.cos(a))));
    }
    return new THREE.LatheGeometry(pts, 128);
  }, [radius, thickness, width]);
  return (
    <mesh geometry={geo} {...props}>
      <meshPhysicalMaterial color={color} metalness={1} roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
    </mesh>
  );
}

function Diamond(props) {
  // Brilliant-cut approximation: crown (short cone) + pavilion (deep cone)
  return (
    <group {...props}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.07, 0.13, 0.08, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={1} ior={2.42} thickness={0.5} roughness={0} flatShading dispersion={5} />
      </mesh>
      <mesh position={[0, -0.09, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.13, 0.18, 16]} />
        <meshPhysicalMaterial color="#ffffff" transmission={1} ior={2.42} thickness={0.5} roughness={0} flatShading dispersion={5} />
      </mesh>
      {/* Prongs */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos((i * Math.PI) / 2 + 0.78) * 0.12, -0.02, Math.sin((i * Math.PI) / 2 + 0.78) * 0.12]}>
          <capsuleGeometry args={[0.014, 0.12, 4, 8]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Simple gravity + bounce simulation for one ring.
 * Falls from `startY`, bounces with energy loss, squashes on impact,
 * spins fast while falling and settles. Calls onImpact on each bounce.
 */
function useDropBounce({ startY = 7, delay = 0, onImpact }) {
  const ref = useRef();
  const s = useRef({ y: startY, v: 0, t: 0, squash: 0, spin: 14, done: false });
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30); // avoid tunnelling on frame drops
    const st = s.current;
    st.t += dt;
    if (!ref.current) return;
    if (st.t < delay) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;

    if (!st.done) {
      st.v -= 22 * dt; // gravity
      st.y += st.v * dt;
      if (st.y <= 0) {
        st.y = 0;
        const impact = Math.abs(st.v);
        st.v = impact * 0.48; // restitution
        st.squash = Math.min(impact / 18, 0.35);
        onImpact?.(impact);
        if (st.v < 0.6) {
          st.v = 0;
          st.done = true;
        }
      }
    }
    st.squash = THREE.MathUtils.lerp(st.squash, 0, 0.15);
    st.spin = THREE.MathUtils.lerp(st.spin, 0, 0.03);

    ref.current.position.y = st.y;
    ref.current.rotation.y += st.spin * dt;
    // squash & stretch (volume-preserving feel)
    ref.current.scale.set(1 + st.squash * 0.5, 1 - st.squash, 1 + st.squash * 0.5);
  });
  return ref;
}

/** Expanding golden shockwave + flash shown when a ring lands. */
function ImpactRipple({ trigger }) {
  const mesh = useRef();
  const life = useRef(1);
  const last = useRef(0);
  useFrame((_, dt) => {
    if (trigger.current.count !== last.current) {
      last.current = trigger.current.count;
      life.current = 0;
      mesh.current.userData.strength = Math.min(trigger.current.strength / 15, 1);
    }
    life.current = Math.min(life.current + dt * 1.4, 1);
    const l = life.current;
    mesh.current.scale.setScalar(0.5 + l * 2.5);
    mesh.current.material.opacity = (1 - l) * 0.6 * (mesh.current.userData.strength ?? 0);
  });
  return (
    <mesh ref={mesh} position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1, 64]} />
      <meshBasicMaterial color={GOLD} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Rings() {
  const group = useRef();
  const impact = useRef({ count: 0, strength: 0 });
  const onImpact = (v) => {
    if (v < 2) return;
    impact.current = { count: impact.current.count + 1, strength: v };
  };

  // Engagement ring drops first, wedding band follows and lands interlocked
  const ringA = useDropBounce({ startY: 7, delay: 0.6, onImpact });
  const ringB = useDropBounce({ startY: 8, delay: 1.1, onImpact });

  useFrame((_, dt) => (group.current.rotation.y += dt * 0.15));

  return (
    <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.5}>
      <group rotation={[0.35, 0, 0.15]} scale={0.9}>
        <group ref={group}>
          {/* Engagement ring with diamond */}
          <group ref={ringA}>
            <group position={[-0.3, 0, 0]} rotation={[Math.PI / 2, 0.45, 0]}>
              <Band radius={0.72} thickness={0.055} width={0.12} />
              <Diamond position={[0, 0, 0.84]} rotation={[Math.PI / 2, 0, 0]} />
            </group>
          </group>
          {/* Wider wedding band */}
          <group ref={ringB}>
            <Band position={[0.35, 0, 0]} rotation={[0, 0, Math.PI / 2 - 0.4]} radius={0.82} thickness={0.07} width={0.2} color="#E6C76A" />
          </group>
        </group>
        <ImpactRipple trigger={impact} />
      </group>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/* Botanicals: eucalyptus-style leaves, lily petals, baby's breath     */
/* ------------------------------------------------------------------ */

function Botanicals({ count }) {
  const leafGeo = useMemo(
    () => sculptBlade({ length: 1.5, width: 0.55, base: '#3E6B4E', edge: '#9AAE73', rib: '#C9D8A8' }),
    []
  );
  const petalGeo = useMemo(
    () => sculptBlade({ length: 0.9, width: 0.42, fold: 0.1, arch: 0.25, twist: 0.5, base: '#E9F0D8', edge: '#FFFFFF', rib: '#F3F6EA' }),
    []
  );
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, -1 - Math.random() * 5],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.35 + Math.random() * 0.45,
        petal: i % 3 === 0,
        speed: 0.4 + Math.random() * 0.8,
      })),
    [count]
  );

  return items.map((it, i) => (
    <Float key={i} speed={it.speed} rotationIntensity={1} floatIntensity={1.4}>
      <mesh position={it.position} rotation={it.rotation} scale={it.scale} geometry={it.petal ? petalGeo : leafGeo}>
        <meshPhysicalMaterial
          vertexColors
          side={THREE.DoubleSide}
          roughness={it.petal ? 0.5 : 0.4}
          sheen={1}
          sheenRoughness={0.5}
          sheenColor={it.petal ? '#FFFFFF' : '#DDE8C4'}
          clearcoat={it.petal ? 0 : 0.4}
          clearcoatRoughness={0.4}
          transmission={it.petal ? 0.2 : 0}
          thickness={0.1}
        />
      </mesh>
    </Float>
  ));
}

/** Gypsophila (baby's breath) sprig: thin branching stems with tiny white blossoms. */
function BabysBreath(props) {
  const { stems, blossoms } = useMemo(() => {
    const stems = [], blossoms = [];
    for (let b = 0; b < 7; b++) {
      const a = (b / 7) * Math.PI * 2;
      const tip = new THREE.Vector3(Math.cos(a) * 0.6, 1 + Math.random() * 0.6, Math.sin(a) * 0.6);
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(tip.x * 0.2, tip.y * 0.6, tip.z * 0.2), tip);
      stems.push(curve);
      for (let k = 0; k < 9; k++) {
        blossoms.push(tip.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.35, (Math.random() - 0.3) * 0.3, (Math.random() - 0.5) * 0.35)));
      }
    }
    return { stems, blossoms };
  }, []);
  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
      <group {...props}>
        {stems.map((c, i) => (
          <mesh key={i}>
            <tubeGeometry args={[c, 16, 0.008, 5, false]} />
            <meshStandardMaterial color="#7E9160" roughness={0.8} />
          </mesh>
        ))}
        {blossoms.map((p, i) => (
          <mesh key={i} position={p}>
            <dodecahedronGeometry args={[0.045, 1]} />
            <meshPhysicalMaterial color="#FFFFFF" roughness={0.7} sheen={1} sheenColor="#FFFDF5" />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ------------------------------------------------------------------ */

/** Eases the camera toward the pointer for a subtle parallax effect. */
function CameraRig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.8, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.5, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Hero background canvas. Fewer objects on small screens for performance. */
export default function Scene3D() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, isMobile ? 8 : 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#FFF4E0" />
      <directionalLight position={[-5, -2, 3]} intensity={0.4} color="#E8F0DA" />

      {/* Soft studio environment (built locally, no network needed) for realistic gold & diamond reflections */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -5]} scale={[10, 3, 1]} color="#FFF6E5" />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#F3E3B8" />
        <Lightformer form="ring" intensity={1.5} position={[0, 0, 6]} scale={3} />
      </Environment>

      <Rings />

      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.6}>
        <Lily position={isMobile ? [-1.6, 2.3, -1] : [-3.6, 0.6, -0.5]} rotation={[0.5, 0, 0.5]} scale={isMobile ? 0.6 : 0.85} />
      </Float>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
        <Lily position={isMobile ? [1.7, -2.4, -1] : [3.7, -0.9, -0.8]} rotation={[0.6, 0, -0.6]} scale={isMobile ? 0.55 : 0.75} delay={0.8} />
      </Float>
      {!isMobile && (
        <>
          <Float speed={0.9} floatIntensity={0.8}>
            <Lily position={[2.6, 2.2, -3]} rotation={[0.9, 0, -0.3]} scale={0.5} delay={1.6} />
          </Float>
          <BabysBreath position={[-3.2, -2.8, -1.5]} rotation={[0, 0, 0.4]} scale={1.1} />
          <BabysBreath position={[4.2, 1.2, -2.5]} rotation={[0, 0, -0.5]} scale={0.9} />
        </>
      )}

      <Botanicals count={isMobile ? 8 : 16} />
      {/* Floating gold dust */}
      <Sparkles count={isMobile ? 30 : 60} scale={[12, 8, 6]} size={2.5} speed={0.3} color={GOLD} opacity={0.7} />
      <CameraRig />
    </Canvas>
  );
}
