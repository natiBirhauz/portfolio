"use client";

import { useRef, useEffect, MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Raining complex line-and-circle shapes
function RainingShapes({ mouseRef }: { mouseRef: MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const shapesRef = useRef<
    Array<{
      group: THREE.Group;
      velocity: THREE.Vector3;
      rotationSpeed: THREE.Vector3;
      radius: number;
      bounce?: boolean;
    }>
  >([]);

  useEffect(() => {
    if (!groupRef.current) return;

    const shapes: typeof shapesRef.current = [];

    const createComplexShape = () => {
      // simpler wireframe geometric shapes: tetra, octa, icosa, box
      const geometries = [
        new THREE.TetrahedronGeometry(0.6, 0),
        new THREE.OctahedronGeometry(0.6, 0),
        new THREE.IcosahedronGeometry(0.6, 0),
        new THREE.BoxGeometry(1, 1, 1),
      ];

      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const edges = new THREE.EdgesGeometry(geo);
      const colorLine = Math.random() < 0.6 ? 0x60a5fa : 0x34d399; // blue or teal
      const mat = new THREE.LineBasicMaterial({ color: colorLine, transparent: true, opacity: 0.95 });
      const lines = new THREE.LineSegments(edges, mat);

      const group = new THREE.Group();
      group.add(lines);

      // small scale variation
      const s = 0.7 + Math.random() * 1.1;
      group.scale.set(s, s, s);

      // radius for interaction roughly based on scale
      const radius = 0.6 * s;
      const bounce = true; // keep simple: no bouncing to avoid jiggle

      return { group, radius, bounce };
    };

    const spawnCount = 16; // increase for denser rain
    for (let i = 0; i < spawnCount; i++) {
      const { group, radius, bounce } = createComplexShape() as any;
      // spread shapes across a taller vertical range so many are visible at start
      group.position.set((Math.random() - 0.5) * 12, Math.random() * 26 + 6, (Math.random() - 0.5) * 10);
      // gentle initial rotation
      group.rotation.set(Math.random() * 0.6, Math.random() * 0.6, Math.random() * 0.6);

      groupRef.current.add(group);

      shapes.push({
        group,
        // even slower downward speed so shapes fall gently
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.001, -0.008 - Math.random() * 0.001, (Math.random() - 0.5) * 0.001),
        rotationSpeed: new THREE.Vector3((Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03),
        radius,
        bounce: !!bounce,
      });
    }

    shapesRef.current = shapes;

    return () => {
      shapes.forEach(({ group }) => {
        if (group.parent) group.parent.remove(group);
        group.traverse((obj) => {
          if ((obj as any).geometry) (obj as any).geometry.dispose();
          if ((obj as any).material) {
            const m = (obj as any).material;
            if (Array.isArray(m)) m.forEach((mm: any) => mm.dispose());
            else m.dispose();
          }
        });
      });
    };
  }, []);

  useFrame(() => {
    // read shared normalized mouse from parent (updated via pointermove)
    const m = mouseRef.current;

    shapesRef.current.forEach((shapeObj: any) => {
      const { group, velocity, rotationSpeed } = shapeObj;

      // small constant gravity to ensure downward motion (very gentle)
      velocity.y -= 0.00001;
      // clamp downward speed so shapes never fall too fast
      velocity.y = Math.max(velocity.y, -0.035);
      // no hover repulsion; shapes should fall straight down

      // apply velocity and rotation
      group.position.add(velocity);
      // damp horizontal drift to keep shapes falling downward
      velocity.x *= 0.985;
      velocity.z *= 0.985;
      // clamp sideways velocity so shapes don't fly off-screen
      velocity.x = THREE.MathUtils.clamp(velocity.x, -0.035, 0.035);
      velocity.z = THREE.MathUtils.clamp(velocity.z, -0.035, 0.035);
      group.rotation.x += rotationSpeed.x;
      group.rotation.y += rotationSpeed.y;
      group.rotation.z += rotationSpeed.z;

      // respawn when falling past bottom
      if (group.position.y < -8) {
        group.position.y = Math.random() * 6 + 8;
        group.position.x = (Math.random() - 0.5) * 10;
        group.position.z = (Math.random() - 0.5) * 6;
        velocity.set((Math.random() - 0.5) * 0.008, -0.02 - Math.random() * 0.02, (Math.random() - 0.5) * 0.006);
      }
    });
  });

  const handleClick = (event: any) => {
    event.stopPropagation();
    const clickPoint: THREE.Vector3 = event.point;

    shapesRef.current.forEach(({ group, velocity, rotationSpeed, radius }: any) => {
      const dist = group.position.distanceTo(clickPoint);
      if (dist < Math.max(1.2, radius * 1.8)) {
        // apply a direct outward impulse
        const dir = group.position.clone().sub(clickPoint).normalize();
        velocity.add(dir.multiplyScalar(0.14 + Math.random() * 0.06));
        // slightly increase spin for feedback
        rotationSpeed.x += (Math.random() - 0.5) * 0.08;
        rotationSpeed.y += (Math.random() - 0.5) * 0.08;
        rotationSpeed.z += (Math.random() - 0.5) * 0.08;
      }
    });
  };

  return <group ref={groupRef} onClick={handleClick} />;
}

// Connected low-poly background like marble (triangulated mesh network)
function LowPolyBackground() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    // Create a large plane with triangulated faces
    const geometry = new THREE.IcosahedronGeometry(12, 2); // larger subdivided icosahedron
    
    // Randomize vertices to create irregular low-poly look
    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += (Math.random() - 0.5) * 1.5;     // x
      positions[i + 1] += (Math.random() - 0.5) * 1.5; // y
      positions[i + 2] += (Math.random() - 0.5) * 1.5; // z
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    // Create the solid mesh with flat shading
    const material = new THREE.MeshStandardMaterial({
      color: "#10b981",
      flatShading: true,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -15);

    // Create edges (lines connecting the triangles)
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#14b8a6",
      transparent: true,
      opacity: 0.25,
    });
    const lineSegments = new THREE.LineSegments(edges, lineMaterial);
    lineSegments.position.set(0, 0, -15);

    groupRef.current.add(mesh);
    groupRef.current.add(lineSegments);

    return () => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      edges.dispose();
      lineMaterial.dispose();
      groupRef.current?.remove(mesh);
      groupRef.current?.remove(lineSegments);
    };
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = performance.now() / 1000;
    // very slow rotation to show the 3D structure
    groupRef.current.rotation.x = t * 0.015;
    groupRef.current.rotation.y = t * 0.02;
  });

  return <group ref={groupRef} />;
}

// Wave grid with mouse interaction
function WaveGrid({ mouseRef }: { mouseRef: MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const geometry = mesh.geometry as THREE.PlaneGeometry;
    const time = mesh.userData.time ?? 0;
    // time via clock is fine but avoid state param; use performance time
    const t = performance.now() / 1000;

    // Update vertices
    const posArray = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < posArray.length; i += 3) {
      const x = posArray[i];
      const y = posArray[i + 1];

      // Waves
      const wave1 = Math.sin(x * 0.5 + time * 0.3) * 0.1;
      const wave2 = Math.sin(y * 0.5 + time * 0.2) * 0.1;

      // Mouse influence
      const dist = Math.sqrt(x * x + y * y);
      // stronger mouse influence on the wave
      const mouseInfluence = Math.sin(dist - t + mouseRef.current.x * 2 + mouseRef.current.y * 2) * 0.6;

      posArray[i + 2] = wave1 + wave2 + mouseInfluence;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    // Rotate based on mouse
    // amplify rotation response
    mesh.rotation.x = -Math.PI / 3 + mouseRef.current.y * 0.5;
    mesh.rotation.z = mouseRef.current.x * 0.35;
    // stretch/squeeze the grid based on mouse position
    const baseScaleX = 1.5;
    const baseScaleY = 0.7;
    // mouse.x in [-1,1] — scale x more when mouse moves horizontally
    mesh.scale.x = Math.max(2, baseScaleX * (1 + mouseRef.current.x * 1.0));
    // mouse.y controls vertical squeeze/stretch
    mesh.scale.y = Math.max(0.5, baseScaleY * (1 + mouseRef.current.y * 0.8));
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -3.5, -3]} scale={[3.5, 0.7, 1]}>
      <planeGeometry args={[10, 6, 50, 30]} />
      <meshStandardMaterial
        color="#14b8a6"
        wireframe
        transparent
        opacity={0.35}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sharedMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerMove = (ev: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);
      sharedMouse.current.x = nx;
      sharedMouse.current.y = ny;
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[2]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent', pointerEvents: 'auto' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />

        <LowPolyBackground />
        <RainingShapes mouseRef={sharedMouse} />
        <WaveGrid mouseRef={sharedMouse} />
      </Canvas>
    </div>
  );
}
