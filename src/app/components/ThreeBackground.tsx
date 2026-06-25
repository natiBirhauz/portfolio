"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GeometricShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate geometric shapes with connected nodes
  const shapes = useMemo(() => {
    const shapesData = [];
    
    for (let i = 0; i < 8; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 3 + Math.random() * 4;
      
      shapesData.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
        scale: 0.3 + Math.random() * 0.4,
        type: Math.floor(Math.random() * 3), // 0: tetrahedron, 1: octahedron, 2: icosahedron
      });
    }
    
    return shapesData;
  }, []);

  // Rotation animation with mouse influence
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.02 + state.mouse.y * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03 + state.mouse.x * 0.1;
      
      // Rotate individual shapes
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += 0.005 * (i % 2 === 0 ? 1 : -1);
        child.rotation.y += 0.007 * (i % 2 === 0 ? -1 : 1);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <group key={i} position={shape.position} rotation={shape.rotation} scale={shape.scale}>
          {/* Main geometric shape - wireframe */}
          <lineSegments>
            {shape.type === 0 && <tetrahedronGeometry args={[1, 0]} />}
            {shape.type === 1 && <octahedronGeometry args={[1, 0]} />}
            {shape.type === 2 && <icosahedronGeometry args={[1, 0]} />}
            <lineBasicMaterial color="#10b981" transparent opacity={0.7} linewidth={2} />
          </lineSegments>
          
          {/* Connecting nodes at vertices */}
          <points>
            {shape.type === 0 && <tetrahedronGeometry args={[1, 0]} />}
            {shape.type === 1 && <octahedronGeometry args={[1, 0]} />}
            {shape.type === 2 && <icosahedronGeometry args={[1, 0]} />}
            <pointsMaterial 
              color="#14b8a6" 
              size={0.08} 
              transparent 
              opacity={0.9}
              sizeAttenuation
            />
          </points>
          
          {/* Inner connecting lines */}
          <lineSegments>
            {shape.type === 0 && <tetrahedronGeometry args={[0.5, 0]} />}
            {shape.type === 1 && <octahedronGeometry args={[0.5, 0]} />}
            {shape.type === 2 && <icosahedronGeometry args={[0.5, 0]} />}
            <lineBasicMaterial color="#059669" transparent opacity={0.4} />
          </lineSegments>
        </group>
      ))}
    </group>
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
    <mesh ref={ref} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2.5, -3]} scale={[1.5, 0.7, 1]} material={material}>
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
        
        {/* Geometric shapes */}
        <GeometricShapes />
        
        {/* Wave grid */}
        <WaveGrid />
      </Canvas>
    </div>
  );
}
