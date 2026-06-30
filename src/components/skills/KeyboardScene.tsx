"use client";
import { Suspense, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import type { Skill } from "@/types";

// ---- Individual Key ----
interface KeyProps {
  skill: Skill;
  position: [number, number, number];
  onHover: (skill: Skill | null) => void;
  onClick: (skill: Skill) => void;
}

function MechanicalKey({ skill, position, onHover, onClick }: KeyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [particles, setParticles] = useState<{ id: number; vel: THREE.Vector3 }[]>([]);

  useFrame((_, delta) => {
    if (!meshRef.current || !baseRef.current) return;

    // Hover lift
    const targetY = hovered ? 0.12 : pressed ? -0.06 : 0;
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      0.15
    );

    // Emissive glow
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const targetIntensity = hovered ? 0.35 : pressed ? 0.6 : 0;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetIntensity, 0.12);
  });

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
      onHover(skill);
      document.body.style.cursor = "pointer";
    },
    [skill, onHover]
  );

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(false);
      onHover(null);
      document.body.style.cursor = "default";
    },
    [onHover]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      setPressed(true);
      onClick(skill);
      setTimeout(() => setPressed(false), 200);
    },
    [skill, onClick]
  );

  const color = new THREE.Color(skill.brandColor || skill.color);
  const baseColor = new THREE.Color("#1A2540");

  return (
    <group position={position}>
      {/* Key base (housing) */}
      <mesh ref={baseRef} receiveShadow>
        <boxGeometry args={[0.85, 0.08, 0.85]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* Key cap */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        castShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={[0.78, 0.12, 0.78]} />
        <meshStandardMaterial
          color={hovered || pressed ? color : new THREE.Color("#1F2D4A")}
          emissive={color}
          emissiveIntensity={0}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Key label (skill icon) */}
      <Text
        position={[0, 0.12, 0]}
        fontSize={0.2}
        color={hovered ? "#ffffff" : "#8892A4"}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {skill.name.slice(0, 4)}
      </Text>
    </group>
  );
}

// ---- Keyboard body ----
function KeyboardBody() {
  return (
    <group>
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[7.5, 0.18, 4.2]} />
        <meshStandardMaterial
          color="#111B2F"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      {/* Subtle edge chamfer indicator */}
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[7.55, 0.06, 4.25]} />
        <meshStandardMaterial color="#0D1526" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ---- Ambient particles when key is pressed ----
function KeyParticle({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const vel = useRef(
    new THREE.Vector3(
      (Math.random() - 0.5) * 0.04,
      Math.random() * 0.06 + 0.02,
      (Math.random() - 0.5) * 0.04
    )
  );
  const life = useRef(1);

  useFrame(() => {
    if (!ref.current) return;
    life.current -= 0.025;
    if (life.current <= 0) return;
    ref.current.position.add(vel.current);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = life.current;
    ref.current.scale.setScalar(life.current);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.03, 4, 4]} />
      <meshBasicMaterial color="#4F8EF7" transparent opacity={1} />
    </mesh>
  );
}

// ---- Full keyboard scene ----
interface KeyboardSceneProps {
  skills: Skill[];
  onSkillHover: (skill: Skill | null) => void;
  onSkillClick: (skill: Skill) => void;
}

const KEY_SPACING = 1.05;

export function KeyboardSceneInner({ skills, onSkillHover, onSkillClick }: KeyboardSceneProps) {
  // Build key positions: assign skills to keyboard rows
  const keyPositions = skills.map((skill, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const x = (col - 1.5) * KEY_SPACING;
    const z = (row - 1.5) * KEY_SPACING;
    return { skill, position: [x, 0, z] as [number, number, number] };
  });

  return (
    <group rotation={[0.2, -0.35, 0]}>
      <KeyboardBody />
      {keyPositions.map(({ skill, position }) => (
        <MechanicalKey
          key={skill.id}
          skill={skill}
          position={[position[0], 0.05, position[2]]}
          onHover={onSkillHover}
          onClick={onSkillClick}
        />
      ))}
      {/* Keyboard LED strip */}
      <mesh position={[0, -0.12, 2.1]}>
        <boxGeometry args={[7.5, 0.04, 0.08]} />
        <meshBasicMaterial color="#4F8EF7" />
      </mesh>
    </group>
  );
}

interface KeyboardCanvasProps {
  skills: Skill[];
  onSkillHover: (skill: Skill | null) => void;
  onSkillClick: (skill: Skill) => void;
}

export function KeyboardCanvas({ skills, onSkillHover, onSkillClick }: KeyboardCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 5, 7], fov: 45 }}
      shadows
      dpr={[1, 2]}
      style={{ background: "transparent" }}
      aria-label="3D Mechanical Keyboard — interact with keys to explore skills"
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 3, 0]} color="#4F8EF7" intensity={0.6} />

      <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.2}>
        <Suspense fallback={null}>
          <KeyboardSceneInner
            skills={skills}
            onSkillHover={onSkillHover}
            onSkillClick={onSkillClick}
          />
        </Suspense>
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 5}
        rotateSpeed={0.4}
        dampingFactor={0.08}
        enableDamping
      />
    </Canvas>
  );
}
