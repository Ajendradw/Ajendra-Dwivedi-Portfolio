import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  Sphere, 
  Stars,
  PerspectiveCamera,
  Points,
  PointMaterial,
  useScroll,
} from '@react-three/drei';
import * as THREE from 'three';

export default function Hero3D() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { mouse } = useThree();
  const scroll = useScroll();

  // Generate data stream points
  const points = useMemo(() => {
    const p = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const s = scroll.offset; // 0 to 1
    
    // Smooth mouse parallax + scroll rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (mouse.x * Math.PI) / 10 + s * Math.PI, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (-mouse.y * Math.PI) / 10, 0.1);
      groupRef.current.position.y = -s * 5;
    }

    // Individual element animations
    if (sphereRef.current) {
      sphereRef.current.rotation.x = t * 0.2;
      sphereRef.current.rotation.y = t * 0.3;
      sphereRef.current.scale.setScalar(2.2 + Math.sin(t) * 0.1);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.5 + s * 5;
      ring1Ref.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.3 - s * 3;
      ring2Ref.current.scale.setScalar(1 + Math.cos(t * 0.5) * 0.05);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#7000ff" />
      <spotLight position={[0, 5, 10]} angle={0.15} penumbra={1} intensity={2} color="#ff007a" />

      {/* Data Stream Points */}
      <Points positions={points}>
        <PointMaterial
          transparent
          color="#00f2ff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      <group ref={groupRef}>
        {/* Central Cyber Sphere */}
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Sphere 
            ref={sphereRef} 
            args={[1, 64, 64]} 
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <MeshDistortMaterial
              color={hovered ? "#ff007a" : "#00f2ff"}
              speed={4}
              distort={0.5}
              radius={1}
              opacity={0.4}
              transparent
              wireframe={!hovered}
            />
          </Sphere>
        </Float>

        {/* Digital Ring 1 */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3, 0.02, 16, 100]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={2} />
        </mesh>

        {/* Digital Ring 2 */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[3.5, 0.01, 16, 100]} />
          <meshStandardMaterial color="#7000ff" emissive="#7000ff" emissiveIntensity={2} />
        </mesh>

        {/* Floating Cyber Bits */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Float key={i} speed={Math.random() * 2 + 1} rotationIntensity={2} floatIntensity={2}>
            <mesh position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 5
            ]}>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial 
                color={i % 2 === 0 ? "#00f2ff" : "#ff007a"} 
                emissive={i % 2 === 0 ? "#00f2ff" : "#ff007a"} 
                emissiveIntensity={1} 
              />
            </mesh>
          </Float>
        ))}
      </group>

      {/* Background Grid */}
      <gridHelper args={[20, 20, "#141414", "#1a1a1a"]} position={[0, -5, 0]} />
    </>
  );
}
