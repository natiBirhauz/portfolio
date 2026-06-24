"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random particle positions in a sphere
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(3000);
    
    for (let i = 0; i < 1000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 2 + Math.random() * 3;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    return positions;
  }, []);

  // Slow rotation animation with mouse influence
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.03 + state.mouse.y * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * 0.05 + state.mouse.x * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#10b981"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function WaveGrid() {
  const ref = useRef<THREE.Mesh>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  
  // Track mouse position
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime;
      const geometry = ref.current.geometry as THREE.PlaneGeometry;
      const positionAttribute = geometry.attributes.position;
      
      // Smoothly interpolate mouse influence
      const targetMouseX = (state.mouse.x * Math.PI) / 4;
      const targetMouseY = (state.mouse.y * Math.PI) / 4;
      mouseX.current += (targetMouseX - mouseX.current) * 0.05;
      mouseY.current += (targetMouseY - mouseY.current) * 0.05;
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        
        // Base waves
        const wave1 = Math.sin(x * 0.5 + time * 0.3) * 0.1;
        const wave2 = Math.sin(y * 0.5 + time * 0.2) * 0.1;
        const wave3 = Math.sin((x + y) * 0.3 + time * 0.4) * 0.05;
        
        // Mouse influence - creates ripple effect following cursor
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        const mouseInfluence = Math.sin(distanceFromCenter - time + mouseX.current + mouseY.current) * 0.15;
        
        positionAttribute.setZ(i, wave1 + wave2 + wave3 + mouseInfluence);
      }
      
      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
      
      // Subtle rotation based on mouse
      ref.current.rotation.x = -Math.PI / 3 + mouseY.current * 0.1;
      ref.current.rotation.z = mouseX.current * 0.1;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 3, 0, 0]} position={[0, -1.5, -2]}>
      <planeGeometry args={[6, 6, 32, 32]} />
      <meshStandardMaterial
        color="#14b8a6"
        wireframe
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-[2] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        style={{ background: 'transparent' }}
      >
        {/* Subtle ambient light */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        
        {/* Particle field */}
        <ParticleField />
        
        {/* Wave grid */}
        <WaveGrid />
      </Canvas>
    </div>
  );
}
