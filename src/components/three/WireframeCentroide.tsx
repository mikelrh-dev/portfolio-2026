import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const NUM_COMPONENTS = 10;
const HIGHLIGHT_INDEX = 5;

interface ComponentDef {
  geometry: THREE.BufferGeometry;
  edges: THREE.EdgesGeometry;
  startPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  startRot: THREE.Euler;
  targetRot: THREE.Euler;
  isHighlight: boolean;
}

function makeComponents(): ComponentDef[] {
  const components: ComponentDef[] = [];
  const geomFactories = [
    () => new THREE.IcosahedronGeometry(0.5, 0),
    () => new THREE.TorusGeometry(0.4, 0.1, 8, 16),
    () => new THREE.CylinderGeometry(0.2, 0.2, 0.8, 8),
    () => new THREE.BoxGeometry(0.5, 0.5, 0.5),
  ];

  const geomPattern = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1];

  for (let i = 0; i < NUM_COMPONENTS; i++) {
    const factory = geomFactories[geomPattern[i] as number]!;
    const geometry = factory();

    const startPos = new THREE.Vector3(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 6,
    );

    const angle = (i / NUM_COMPONENTS) * Math.PI * 2;
    const radius = 1.2 + Math.random() * 0.8;
    const targetPos = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      (Math.random() - 0.5) * 1.5,
    );

    const startRot = new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    );

    const targetRot = new THREE.Euler(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
    );

    components.push({
      geometry,
      edges: new THREE.EdgesGeometry(geometry),
      startPos,
      targetPos,
      startRot,
      targetRot,
      isHighlight: i === HIGHLIGHT_INDEX,
    });
  }
  return components;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const scrollProgress = useScrollProgress();
  const reducedMotion = useReducedMotion();
  const components = useMemo(makeComponents, []);
  const meshRefs = useRef<(THREE.LineSegments | null)[]>([]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;

    if (!reducedMotion) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        mouse.current.y * 0.3,
        0.05,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        mouse.current.x * 0.3,
        0.05,
      );
    }

    const progress = reducedMotion ? 1 : scrollProgress.current;
    const eased = easeInOutCubic(Math.min(progress * 2, 1));

    components.forEach((c, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      mesh.position.lerpVectors(c.startPos, c.targetPos, eased);
      mesh.rotation.x = THREE.MathUtils.lerp(c.startRot.x, c.targetRot.x, eased);
      mesh.rotation.y = THREE.MathUtils.lerp(c.startRot.y, c.targetRot.y, eased);
      mesh.rotation.z = THREE.MathUtils.lerp(c.startRot.z, c.targetRot.z, eased);
    });
  });

  return (
    <group ref={group}>
      {components.map((c, i) => (
        <lineSegments
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={c.edges}
          position={c.startPos}
        >
          <lineBasicMaterial
            color={c.isHighlight ? '#CCFF00' : '#FFFFFF'}
            linewidth={1}
          />
        </lineSegments>
      ))}
    </group>
  );
}

export function WireframeCentroide() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <Scene />
      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
      </EffectComposer>
    </Canvas>
  );
}

export default WireframeCentroide;