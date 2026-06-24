"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const clickForce = useRef(new THREE.Vector3(0, 0, 0));
  const clickStrength = useRef(0);
  const velocities = useMemo(() => {
    const data = new Float32Array(3000);
    for (let i = 0; i < 1000; i++) {
      data[i * 3] = (Math.random() - 0.5) * 0.003;
      data[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      data[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return data;
  }, []);

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

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      clickForce.current.set(x * 4.2, y * 2.6, 0);
      clickStrength.current = 1;
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // Slow rotation animation with mouse influence and click-driven drift
  useFrame((state, delta) => {
    if (!ref.current) return;

    const positions = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const impulse = clickStrength.current;
    const force = clickForce.current;

    for (let i = 0; i < 1000; i++) {
      const idx = i * 3;
      let vx = velocities[idx];
      let vy = velocities[idx + 1];
      let vz = velocities[idx + 2];

      if (impulse > 0) {
        const impulseScale = 0.008 * (0.8 + Math.random() * 0.4);
        vx += force.x * impulseScale;
        vy += force.y * impulseScale;
        vz += (Math.random() - 0.5) * 0.002;
      }

      positions.array[idx] += vx * delta;
      positions.array[idx + 1] += vy * delta;
      positions.array[idx + 2] += vz * delta;

      velocities[idx] = vx * 0.96;
      velocities[idx + 1] = vy * 0.96;
      velocities[idx + 2] = vz * 0.96;

      const x = positions.array[idx];
      const y = positions.array[idx + 1];
      const z = positions.array[idx + 2];
      const distance = Math.sqrt(x * x + y * y + z * z);
      if (distance > 5.5) {
        const scale = 5.5 / distance;
        positions.array[idx] *= scale;
        positions.array[idx + 1] *= scale;
        positions.array[idx + 2] *= scale;
        velocities[idx] *= -0.2;
        velocities[idx + 1] *= -0.2;
        velocities[idx + 2] *= -0.2;
      }
    }

    if (clickStrength.current > 0) {
      clickStrength.current = Math.max(0, clickStrength.current - delta * 1.8);
    }

    positions.needsUpdate = true;

    ref.current.rotation.x = state.clock.elapsedTime * 0.03 + state.mouse.y * 0.1;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05 + state.mouse.x * 0.1;
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
  const windowMouse = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      windowMouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      windowMouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);
  
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
      const targetMouseX = state.mouse.x || windowMouse.current.x;
      const targetMouseY = state.mouse.y || windowMouse.current.y;
      
      prevMouseX.current = mouseX.current;
      prevMouseY.current = mouseY.current;
      
      mouseX.current += (targetMouseX - mouseX.current) * 0.12;
      mouseY.current += (targetMouseY - mouseY.current) * 0.12;
      
      // Calculate mouse velocity for stretch direction
      const velocityX = mouseX.current - prevMouseX.current;
      const velocityY = mouseY.current - prevMouseY.current;
      const stretchStrength = 0.75;
      
      // Stretch and compress the plane to emphasize movement direction
      ref.current.scale.set(
        1.5 + Math.abs(velocityX) * 0.18,
        0.7 + Math.abs(velocityY) * 0.12,
        1,
      );
      ref.current.position.x = velocityX * 0.8;
      ref.current.position.y = -1.2 + velocityY * 0.6;
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        
        // Base waves
        const wave1 = Math.sin(x * 0.5 + time * 0.3) * 0.1;
        const wave2 = Math.sin(y * 0.5 + time * 0.2) * 0.1;
        const wave3 = Math.sin((x + y) * 0.3 + time * 0.4) * 0.05;
        
        // Mouse influence - ripple effect following cursor
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        const mouseInfluence = Math.sin(distanceFromCenter * 1.3 - time * 0.8 + mouseX.current * 2.5 + mouseY.current * 2.5) * 0.12;
        
        // Stretch effect based on mouse movement direction
        const directionalStretch = (x * velocityX + y * velocityY) * stretchStrength;
        const stretchX = velocityX * x * 0.7;
        const stretchY = velocityY * y * 0.7;
        
        positionAttribute.setZ(i, wave1 + wave2 + wave3 + mouseInfluence + directionalStretch + stretchX + stretchY);
      }
      
      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
      
      // Subtle rotation based on mouse
      ref.current.rotation.x = -Math.PI / 3 + mouseY.current * 0.16;
      ref.current.rotation.z = mouseX.current * 0.14;
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
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]} // Higher pixel density for a sharper scene
        style={{ background: 'transparent', imageRendering: 'optimizeQuality', transform: 'translateZ(0)' }}
        onPointerMove={(event) => {
          // Ensure the scene can react to pointer movements through the transparent overlay
          event.stopPropagation();
        }}
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
