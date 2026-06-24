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
  const prevMouseX = useRef(0);
  const prevMouseY = useRef(0);
  
  // Create shader material with radial fade
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color("#14b8a6") },
        opacity: { value: 0.35 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Calculate distance from center (0.5, 0.5)
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          
          // Create radial fade - center is more transparent, edges are more opaque
          float radialFade = smoothstep(0.0, 0.5, dist);
          
          // Combine with base opacity
          float finalOpacity = opacity * radialFade;
          
          gl_FragColor = vec4(color, finalOpacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: true,
    });
  }, []);
  
  // Track mouse position and velocity
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime;
      const geometry = ref.current.geometry as THREE.PlaneGeometry;
      const positionAttribute = geometry.attributes.position;
      
      // Smoothly interpolate mouse influence
      const targetMouseX = state.mouse.x;
      const targetMouseY = state.mouse.y;
      
      prevMouseX.current = mouseX.current;
      prevMouseY.current = mouseY.current;
      
      mouseX.current += (targetMouseX - mouseX.current) * 0.08;
      mouseY.current += (targetMouseY - mouseY.current) * 0.08;
      
      // Calculate mouse velocity for stretch direction
      const velocityX = mouseX.current - prevMouseX.current;
      const velocityY = mouseY.current - prevMouseY.current;
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        
        // Base waves
        const wave1 = Math.sin(x * 0.5 + time * 0.3) * 0.1;
        const wave2 = Math.sin(y * 0.5 + time * 0.2) * 0.1;
        const wave3 = Math.sin((x + y) * 0.3 + time * 0.4) * 0.05;
        
        // Mouse influence - creates ripple effect following cursor
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        const mouseInfluence = Math.sin(distanceFromCenter - time + mouseX.current * 3 + mouseY.current * 3) * 0.15;
        
        // Stretch effect based on mouse movement direction
        const stretchX = velocityX * x * 0.5;
        const stretchY = velocityY * y * 0.5;
        
        positionAttribute.setZ(i, wave1 + wave2 + wave3 + mouseInfluence + stretchX + stretchY);
      }
      
      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
      
      // Subtle rotation based on mouse
      ref.current.rotation.x = -Math.PI / 3 + mouseY.current * 0.15;
      ref.current.rotation.z = mouseX.current * 0.1;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 3, 0, 0]} position={[0, -1.2, -2.5]} scale={[1.5, 0.7, 1]} material={material}>
      <planeGeometry args={[10, 6, 50, 30]} />
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
