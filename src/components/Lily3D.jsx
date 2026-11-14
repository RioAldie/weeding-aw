import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural white lily petal: a segmented plane sculpted into a
 * pointed, cupped petal whose tip curls backwards (like an Easter lily).
 */
function usePetalGeometry() {
  return useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1, 10, 24);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const t = p.getY(i) + 0.5; // 0 at base -> 1 at tip
      const width = Math.sin(Math.PI * Math.pow(t, 0.8)) * 0.42 * (1 - t * 0.35);
      const nx = x * width * 2;
      // Cup across the width + backward curl near the tip
      const cup = -Math.pow(nx * 2.2, 2) * 0.12;
      const curl = Math.pow(Math.max(t - 0.45, 0), 2) * 1.6;
      p.setXYZ(i, nx, t * 1.5, cup + curl);
    }
    g.computeVertexNormals();
    return g;
  }, []);
}

/**
 * A single blooming white lily: 6 petals that slowly open and "breathe",
 * with gold-tipped stamens in the center.
 */
export default function Lily({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, delay = 0 }) {
  const petalGeo = usePetalGeometry();
  const petals = useRef([]);
  const group = useRef();

  const stamens = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ a: (i / 6) * Math.PI * 2 + 0.3, tilt: 0.35 + Math.random() * 0.15 })),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime - delay;
    // Bloom: closed bud (0.15 rad) -> open (1.05 rad) over ~4s, then gentle breathing
    const bloom = THREE.MathUtils.smoothstep(t, 0, 4);
    const breathe = Math.sin(t * 0.8) * 0.05;
    petals.current.forEach((m, i) => {
      if (!m) return;
      const inner = i % 2; // alternate inner / outer whorl
      m.rotation.x = 0.15 + bloom * (1.05 - inner * 0.15) + breathe;
    });
    group.current.rotation.y += 0.002;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={group}>
        {Array.from({ length: 6 }, (_, i) => (
          <group key={i} rotation={[0, (i / 6) * Math.PI * 2 + (i % 2) * 0.1, 0]}>
            <mesh ref={(el) => (petals.current[i] = el)} geometry={petalGeo} scale={i % 2 ? 0.92 : 1}>
              <meshPhysicalMaterial
                color="#FFFFFF"
                emissive="#FFF8EC"
                emissiveIntensity={0.15}
                roughness={0.45}
                sheen={1}
                sheenColor="#F4FFE8"
                transmission={0.15}
                thickness={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}

        {/* Pale green throat */}
        <mesh position={[0, 0.05, 0]}>
          <coneGeometry args={[0.12, 0.35, 12]} />
          <meshStandardMaterial color="#C9D8A8" roughness={0.6} />
        </mesh>

        {/* Stamens with gold anthers */}
        {stamens.map(({ a, tilt }, i) => (
          <group key={i} rotation={[0, a, tilt]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.008, 0.012, 1, 6]} />
              <meshStandardMaterial color="#DDE6C4" />
            </mesh>
            <mesh position={[0, 1.02, 0]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.025, 0.08, 4, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Stem */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 2.4, 8]} />
          <meshStandardMaterial color="#8A9A5B" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

