"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { profile } from "@/data/profile";

// ---------------------------------------------------------------------------
// Procedural canvas textures (no external assets) — walnut grain + paper + card
// ---------------------------------------------------------------------------
function makeWoodTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 1024, 512);
  g.addColorStop(0, "#5b3b27");
  g.addColorStop(0.5, "#4a2f1f");
  g.addColorStop(1, "#3a2416");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 150; i++) {
    const y = Math.random() * 512;
    ctx.strokeStyle = `rgba(${28 + Math.random() * 34},${16 + Math.random() * 18},${8 + Math.random() * 12},${0.05 + Math.random() * 0.09})`;
    ctx.lineWidth = 0.5 + Math.random() * 1.6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 28) {
      ctx.lineTo(x, y + Math.sin((x / 1024) * Math.PI * 2 + i) * 4 + (Math.random() - 0.5) * 2.4);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeResumeTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 680;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#FBFAF5";
  ctx.fillRect(0, 0, 512, 680);
  ctx.fillStyle = "#1E2636";
  ctx.font = "bold 68px Georgia, serif";
  ctx.fillText("Resume", 48, 116);
  ctx.fillStyle = "rgba(30,38,54,0.25)";
  ctx.fillRect(48, 140, 300, 5);
  ctx.fillStyle = "rgba(30,38,54,0.16)";
  const widths = [400, 330, 380, 300, 360, 280, 410, 320, 360];
  widths.forEach((w, i) => ctx.fillRect(48, 190 + i * 42, w, 10));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeCardTexture(back: boolean): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 700;
  c.height = 400;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 700, 400);
  if (back) {
    g.addColorStop(0, "#4F8EF7");
    g.addColorStop(1, "#A78BFA");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 700, 400);
    ctx.fillStyle = "#ffffff";
    ctx.font = "italic bold 40px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Let’s Build", 350, 185);
    ctx.fillText("Something Together.", 350, 235);
  } else {
    // Light, clearly-visible card face (cream stock, dark ink).
    g.addColorStop(0, "#FDFEFF");
    g.addColorStop(1, "#E7ECF7");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 700, 400);
    // accent stripe
    ctx.fillStyle = "#4F8EF7";
    ctx.fillRect(0, 0, 12, 400);
    ctx.textAlign = "left";
    ctx.fillStyle = "#16203a";
    ctx.font = "bold 48px Georgia, serif";
    ctx.fillText(profile.name, 56, 128);
    ctx.fillStyle = "#5b6479";
    ctx.font = "27px Arial, sans-serif";
    ctx.fillText(profile.email, 56, 182);
    ctx.fillStyle = "#2f6fe0";
    ctx.font = "bold 25px Arial, sans-serif";
    ctx.fillText("GitHub  ·  LinkedIn", 56, 340);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Laptop screen — a baked prompt so the lid always reads as a lit screen.
function makeScreenTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 480;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 480);
  g.addColorStop(0, "#0d1830");
  g.addColorStop(1, "#0a1120");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 768, 480);
  const rg = ctx.createRadialGradient(384, 110, 20, 384, 110, 430);
  rg.addColorStop(0, "rgba(79,142,247,0.30)");
  rg.addColorStop(1, "rgba(79,142,247,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, 768, 480);
  ctx.textAlign = "center";
  ctx.fillStyle = "#E8EEFF";
  ctx.font = "bold 52px Georgia, serif";
  ctx.fillText("Let’s Build", 384, 175);
  ctx.fillText("Something Together", 384, 235);
  ctx.fillStyle = "#8892A4";
  ctx.font = "24px Arial, sans-serif";
  ctx.fillText("Always exploring. Always building.", 384, 285);
  const bw = 320;
  const bh = 62;
  const bx = 384 - bw / 2;
  const by = 340;
  const pg = ctx.createLinearGradient(bx, 0, bx + bw, 0);
  pg.addColorStop(0, "#4F8EF7");
  pg.addColorStop(1, "#A78BFA");
  ctx.fillStyle = pg;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 31);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px Arial, sans-serif";
  ctx.fillText("Open Contact Form  ▸", 384, by + 40);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// ---------------------------------------------------------------------------
// The walnut table
// ---------------------------------------------------------------------------
function Table({ wood }: { wood: THREE.Texture }) {
  const legX = 2.35;
  const legZ = 1.4;
  const legY = -0.85;
  return (
    <group>
      <RoundedBox args={[5.2, 0.2, 3.3]} radius={0.09} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial map={wood} roughness={0.6} metalness={0.04} />
      </RoundedBox>
      {[
        [-legX, legY, -legZ],
        [legX, legY, -legZ],
        [-legX, legY, legZ],
        [legX, legY, legZ],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 1.5, 20]} />
          <meshStandardMaterial map={wood} roughness={0.6} metalness={0.04} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Desk lamp (3D) + the warm bulb light
// ---------------------------------------------------------------------------
function Lamp() {
  const metal = { roughness: 0.35, metalness: 0.6 } as const;
  const joint = "#3a4d76";
  const arm = "#33456b";
  const [hover, setHover] = useState(false);
  const [on, setOn] = useState(false);
  const lit = hover || on; // shine only on hover, or toggled on by click
  useEffect(() => {
    document.body.style.cursor = hover ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover]);
  return (
    <group
      position={[-2.0, 0.1, -0.8]}
      scale={1.15}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        setOn((v) => !v);
      }}
    >
      {/* weighted round base */}
      <mesh castShadow receiveShadow position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.24, 0.3, 0.06, 40]} />
        <meshStandardMaterial color="#20304f" {...metal} />
      </mesh>
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.09, 0.12, 0.04, 32]} />
        <meshStandardMaterial color={joint} {...metal} />
      </mesh>
      {/* vertical pole */}
      <mesh castShadow position={[0, 0.51, 0]}>
        <cylinderGeometry args={[0.028, 0.034, 0.9, 20]} />
        <meshStandardMaterial color={arm} {...metal} />
      </mesh>
      {/* shoulder joint */}
      <mesh castShadow position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.055, 20, 20]} />
        <meshStandardMaterial color={joint} {...metal} />
      </mesh>
      {/* arm reaching forward over the desk */}
      <mesh castShadow position={[0, 1.0, 0.25]} rotation={[1.4, 0, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 0.52, 20]} />
        <meshStandardMaterial color={arm} {...metal} />
      </mesh>
      {/* wrist joint */}
      <mesh castShadow position={[0, 1.03, 0.5]}>
        <sphereGeometry args={[0.05, 20, 20]} />
        <meshStandardMaterial color={joint} {...metal} />
      </mesh>
      {/* dome shade — open at the wide bottom, pointing down at the desk */}
      <mesh castShadow position={[0, 0.98, 0.52]}>
        <cylinderGeometry args={[0.06, 0.2, 0.22, 32, 1, true]} />
        <meshStandardMaterial color="#2c4066" roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* rounded cap closing the top of the shade */}
      <mesh position={[0, 1.08, 0.52]}>
        <sphereGeometry args={[0.062, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2c4066" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* bulb — dark until lit, glowing warm when hovered/clicked */}
      <mesh position={[0, 0.93, 0.52]}>
        <sphereGeometry args={[0.05, 20, 20]} />
        <meshStandardMaterial color="#fff1cf" emissive="#ffc36e" emissiveIntensity={lit ? 2.8 : 0.1} toneMapped={false} />
      </mesh>
      {/* warm light cast onto the desk — only when the lamp is lit */}
      <pointLight position={[0.15, 0.62, 0.5]} intensity={lit ? 34 : 0} distance={7} decay={2} color="#ffcaa0" castShadow shadow-mapSize={[512, 512]} />
      <pointLight position={[0.15, 0.2, 0.6]} intensity={lit ? 6 : 0} distance={3} decay={2} color="#ffdcae" />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Coffee mug (3D) with steam on hover
// ---------------------------------------------------------------------------
function Mug() {
  const [hover, setHover] = useState(false);
  const steamRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    steamRefs.current.forEach((m, i) => {
      if (!m) return;
      const t = (state.clock.elapsedTime * 0.6 + i * 0.5) % 1;
      m.position.y = 0.42 + t * 0.5;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = hover ? Math.sin(t * Math.PI) * 0.18 : 0;
    });
  });

  return (
    <group
      position={[1.95, 0.1, -0.7]}
      scale={1.1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* white ceramic cup */}
      <mesh castShadow position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.17, 0.15, 0.32, 40]} />
        <meshStandardMaterial color="#F2F5FF" roughness={0.35} metalness={0.05} />
      </mesh>
      {/* solid brown coffee, filling most of the top, recessed just below the
          rim so it never z-fights the cup's top cap */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.02, 40]} />
        <meshStandardMaterial color="#3a2415" roughness={0.35} metalness={0} />
      </mesh>
      {/* fully-formed loop handle on the side */}
      <mesh castShadow position={[0.19, 0.17, 0]}>
        <torusGeometry args={[0.1, 0.028, 20, 40]} />
        <meshStandardMaterial color="#EAEDF6" roughness={0.4} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) steamRefs.current[i] = el;
          }}
          position={[(i - 1) * 0.05, 0.42, 0]}
        >
          <planeGeometry args={[0.04, 0.12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Résumé sheet (3D paper) — lifts on hover, downloads on click
// ---------------------------------------------------------------------------
function Resume({ tex }: { tex: THREE.Texture }) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  useFrame(() => {
    if (!ref.current) return;
    const target = hover ? 0.18 : 0.0;
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0.12 + target, 0.15);
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, hover ? 0.06 : 0.0, 0.15);
  });
  useEffect(() => {
    document.body.style.cursor = hover ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover]);

  return (
    <group
      ref={ref}
      position={[-1.8, 0.12, 0.55]}
      scale={1.1}
      rotation={[-Math.PI / 2, 0, 0.18]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        const a = document.createElement("a");
        a.href = profile.resumeUrl;
        a.download = "";
        a.click();
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[0.62, 0.84, 0.008]} />
        <meshStandardMaterial map={tex} roughness={0.85} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Business card (3D) — flips on click, lifts/tilts on hover
// ---------------------------------------------------------------------------
function Card({ front, back }: { front: THREE.Texture; back: THREE.Texture }) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const [flipped, setFlipped] = useState(false);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, flipped ? Math.PI : 0, 0.12);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, hover ? 0.28 : 0.13, 0.15);
  });
  useEffect(() => {
    document.body.style.cursor = hover ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover]);

  return (
    <group position={[1.95, 0.13, 0.35]} scale={1.1} rotation={[-Math.PI / 2, 0, -0.2]}>
      <group
        ref={ref}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          setFlipped((f) => !f);
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.4, 0.01]} />
          <meshStandardMaterial map={front} roughness={0.5} attach="material-4" />
          <meshStandardMaterial map={back} roughness={0.5} attach="material-5" />
          <meshStandardMaterial color="#e4e9f5" attach="material-0" />
          <meshStandardMaterial color="#e4e9f5" attach="material-1" />
          <meshStandardMaterial color="#e4e9f5" attach="material-2" />
          <meshStandardMaterial color="#e4e9f5" attach="material-3" />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Laptop (3D body) with the screen as a real DOM form via <Html>
// ---------------------------------------------------------------------------
function Laptop({ onOpen }: { onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const lid = useRef<THREE.Group>(null);
  const screenTex = useMemo(() => makeScreenTexture(), []);
  // Open lid angle: only ~20° past vertical so the screen faces the elevated
  // front camera (a larger magnitude tips it flat/back and reads as "closed").
  useFrame(() => {
    if (!lid.current) return;
    lid.current.rotation.x = THREE.MathUtils.lerp(lid.current.rotation.x, hover ? -0.42 : -0.35, 0.1);
  });
  useEffect(() => {
    document.body.style.cursor = hover ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover]);

  return (
    <group position={[0, 0.1, 0.4]} scale={1.4}>
      {/* base / keyboard deck */}
      <RoundedBox args={[1.5, 0.06, 1.0]} radius={0.02} smoothness={3} position={[0, 0.03, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#b7bdca" roughness={0.4} metalness={0.55} />
      </RoundedBox>
      {/* keyboard well — a shallow raised tray (a solid box, not a coplanar
          plane, so it never z-fights the deck the way the old plane did) */}
      <mesh castShadow position={[0, 0.072, 0.12]}>
        <boxGeometry args={[1.28, 0.022, 0.62]} />
        <meshStandardMaterial color="#2b3040" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* trackpad */}
      <mesh position={[0, 0.07, 0.4]}>
        <boxGeometry args={[0.34, 0.016, 0.12]} />
        <meshStandardMaterial color="#9aa1b1" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* lid hinged at the back edge */}
      <group ref={lid} position={[0, 0.06, -0.5]} rotation={[-0.35, 0, 0]}>
        {/* dark bezel */}
        <RoundedBox args={[1.5, 1.0, 0.04]} radius={0.03} smoothness={3} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#23262f" roughness={0.5} metalness={0.35} />
        </RoundedBox>
        {/* the glowing screen — click anywhere on it to open the contact form */}
        <mesh
          position={[0, 0.5, 0.023]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHover(true);
          }}
          onPointerOut={() => setHover(false)}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          <planeGeometry args={[1.34, 0.84]} />
          <meshStandardMaterial
            map={screenTex}
            emissiveMap={screenTex}
            emissive="#ffffff"
            emissiveIntensity={hover ? 1 : 0.7}
            toneMapped={false}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene contents: gentle cursor parallax + entrance ease-up
// ---------------------------------------------------------------------------
function SceneContents({ reduce, onOpen }: { reduce: boolean; onOpen: () => void }) {
  const wood = useMemo(() => makeWoodTexture(), []);
  const resumeTex = useMemo(() => makeResumeTexture(), []);
  const cardFront = useMemo(() => makeCardTexture(false), []);
  const cardBack = useMemo(() => makeCardTexture(true), []);

  const root = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);

  useFrame((state) => {
    const g = root.current;
    if (!g) return;
    // entrance ease-up
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = Math.min(1, (state.clock.elapsedTime - start.current) / 1.2);
    const e = 1 - Math.pow(1 - t, 3);
    g.position.y = reduce ? 0 : -1.4 * (1 - e);
    // cursor parallax
    if (!reduce) {
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.18, 0.05);
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.08, 0.05);
    }
  });

  const inner = (
    <group ref={root}>
      <Table wood={wood} />
      <Lamp />
      <Laptop onOpen={onOpen} />
      <Mug />
      <Resume tex={resumeTex} />
      <Card front={cardFront} back={cardBack} />
      <ContactShadows position={[0, -1.6, 0]} opacity={0.5} scale={12} blur={2.6} far={3.2} color="#000000" />
    </group>
  );

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 3]} intensity={0.85} castShadow shadow-mapSize={[1024, 1024]} />
      <hemisphereLight args={["#cdd7ff", "#1a1208", 0.45]} />
      {reduce ? inner : <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>{inner}</Float>}
    </>
  );
}

export default function WorkbenchScene({ reduce, onOpen }: { reduce: boolean; onOpen: () => void }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2.9, 4.6], fov: 40 }}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContents reduce={reduce} onOpen={onOpen} />
    </Canvas>
  );
}
