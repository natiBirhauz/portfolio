"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface Shape {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  scale: number;
  type: number;
  opacity: number;
}

function RainingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const nextId = useRef(0);
  const mousePos = useRef(new THREE.Vector2(0, 0));

  // Generate new shape
  const createShape = () => {
    return {
      id: nextId.current++,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        8 + Math.random() * 2,
        (Math.random() - 0.5) * 8
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        -0.02 - Math.random() * 0.02,
        (Math.random() - 0.5) * 0.01
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      scale: 0.25 + Math.random() * 0.35,
      type: Math.floor(Math.random() * 3),
      opacity: 0.7,
    };
  };

  // Initialize shapes
  useMemo(() => {
    const initial: Shape[] = [];
    for (let i = 0; i < 12; i++) {
      initial.push(createShape());
    }
    setShapes(initial);
  }, []);

  // Animation loop
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.01;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      
      mousePos.current.set(state.mouse.x, state.mouse.y);
    }

    // Update shapes
    setShapes((prev) =>
      prev.map((shape) => {
        // Update position
        shape.position.add(shape.velocity);
        
        // Mouse influence - push shapes away from cursor
        const mouseInfluence = new THREE.Vector2(
          shape.position.x / 5,
          shape.position.y / 5
        );
        const distToMouse = mouseInfluence.distanceTo(mousePos.current);
        if (distToMouse < 1.5) {
          const pushDir = new THREE.Vector2()
            .subVectors(mouseInfluence, mousePos.current)
            .normalize()
            .multiplyScalar(0.03);
          shape.velocity.x += pushDir.x;
          shape.velocity.y += pushDir.y;
        }
        
        // Update rotation
        shape.rotation.x += shape.rotationSpeed.x;
        shape.rotation.y += shape.rotationSpeed.y;
        shape.rotation.z += shape.rotationSpeed.z;
        
        // Fade out when near bottom
        if (shape.position.y < -6) {
          shape.opacity -= 0.02;
        }
        
        // Reset if out of bounds or faded
        if (shape.position.y < -8 || shape.opacity <= 0) {
          return createShape();
        }
        
        return shape;
      })
    );
  });

  // Handle clicks - explode nearby shapes
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const clickPos = event.point;
    
    setShapes((prev) =>
      prev.map((shape) => {
        const dist = shape.position.distanceTo(clickPos);
        if (dist < 2) {
          // Explode shape outward
          const dir = new THREE.Vector3()
            .subVectors(shape.position, clickPos)
            .normalize();
          shape.velocity.add(dir.multiplyScalar(0.2));
          shape.rotationSpeed.multiplyScalar(3);
        }
        return shape;
      })
    );
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      {shapes.map((shape) => (
        <group
          key={shape.id}
          position={shape.position}
          rotation={shape.rotation}
          scale={shape.scale}
        >
          {/* Main wireframe */}
          <lineSegments>
            {shape.type === 0 && <tetrahedronGeometry args={[1, 0]} />}
            {shape.type === 1 && <octahedronGeometry args={[1, 0]} />}
            {shape.type === 2 && <icosahedronGeometry args={[1, 0]} />}
            <lineBasicMaterial
              color="#10b981"
              transparent
              opacity={shape.opacity * 0.7}
              linewidth={2}
            />
          </lineSegments>

          {/* Vertex nodes */}
          <points>
            {shape.type === 0 && <tetrahedronGeometry args={[1, 0]} />}
            {shape.type === 1 && <octahedronGeometry args={[1, 0]} />}
            {shape.type === 2 && <icosahedronGeometry args={[1, 0]} />}
            <pointsMaterial
              color="#14b8a6"
              size={0.08}
              transparent
              opacity={shape.opacity * 0.9}
              sizeAttenuation
            />
          </points>

          {/* Inner structure */}
          <lineSegments>
            {shape.type === 0 && <tetrahedronGeometry args={[0.5, 0]} />}
            {shape.type === 1 && <octahedronGeometry args={[0.5, 0]} />}
            {shape.type === 2 && <icosahedronGeometry args={[0.5, 0]} />}
            <lineBasicMaterial
              color="#059669"
              transparent
              opacity={shape.opacity * 0.4}
            />
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
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          float radialFade = smoothstep(0.0, 0.5, dist);
          float finalOpacity = opacity * radialFade;
          gl_FragColor = vec4(color, finalOpacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: true,
    });
  }, []);
  
  // Track mouse position and velocity for interactivity
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
        
        // Mouse influence - creates ripple effect
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
    <div className="fixed inset-0 z-[2]" style={{ pointerEvents: 'none' }}>
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
        
        {/* Raining geometric shapes */}
        <RainingShapes />
        
        {/* Interactive wave grid */}
        <WaveGrid />
      </Canvas>
    </div>
  );
}
