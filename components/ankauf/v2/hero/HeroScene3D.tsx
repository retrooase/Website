"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Environment, Lightformer, AdaptiveDpr } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Group, MeshStandardMaterial } from "three";

/**
 * Three.js-Hero-Szene: ein schwebendes Retro-Gaming-Diorama in Gold-/Casino-Optik —
 * Retro-TV mit leuchtendem Pixel-Screen & Antenne, Konsole, SNES-artiger Controller,
 * eine Reihe bunter Spiele-Module und schwebende Goldmünzen ("dein Zeug = Geld").
 * Reagiert sanft auf die Maus (Parallaxe) und schwebt leicht.
 *
 * Performance:
 *   • Render-Loop pausiert per IntersectionObserver (frameloop="never"), sobald
 *     der Hero aus dem Viewport gescrollt ist — kein 60-fps-Leerlauf.
 *   • AdaptiveDpr + performance.min senken die Auflösung kurz bei FPS-Einbrüchen.
 *   • Alles aus einfachen Primitiven, geteilte Material-Presets.
 */

type Vec3 = [number, number, number];

// ── Geteilte Material-Presets (DRY) ────────────────────────────────────
const DARK_PLASTIC = { color: "#15151d", metalness: 0.25, roughness: 0.8 } as const;
const TV_SHELL = { color: "#d8cbb0", metalness: 0.12, roughness: 0.72 } as const;
const CONSOLE_GREY = { color: "#c9c9d4", metalness: 0.3, roughness: 0.55 } as const;
const GOLD = { color: "#F4A91E", metalness: 1, roughness: 0.22, envMapIntensity: 1.5 } as const;

/** Leuchtender Pixel-Screen im Retro-TV (kleine Platformer-Szene). */
function GameScreen() {
  const matRef = useRef<MeshStandardMaterial>(null);

  // Dezentes Flackern → der Bildschirm wirkt "an".
  useFrame((state) => {
    const m = matRef.current;
    if (!m) return;
    m.emissiveIntensity = 1.05 + Math.sin(state.clock.elapsedTime * 6) * 0.08;
  });

  return (
    <group position={[0, 0.12, 0.92]}>
      {/* Himmel / Grundleuchten */}
      <mesh>
        <planeGeometry args={[1.92, 1.34]} />
        <meshStandardMaterial
          ref={matRef}
          color="#06121f"
          emissive="#1f6dd8"
          emissiveIntensity={1.05}
          toneMapped={false}
        />
      </mesh>
      {/* Boden */}
      <mesh position={[0, -0.5, 0.01]}>
        <planeGeometry args={[1.92, 0.34]} />
        <meshStandardMaterial color="#0a3a14" emissive="#2fd35a" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      {/* Sonne / Münze oben rechts */}
      <mesh position={[0.62, 0.42, 0.02]}>
        <circleGeometry args={[0.16, 24]} />
        <meshStandardMaterial color="#ffd34d" emissive="#ffcc33" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      {/* Wolken */}
      {[
        [-0.55, 0.3],
        [-0.2, 0.45],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.02]}>
          <planeGeometry args={[0.26, 0.1]} />
          <meshStandardMaterial color="#dfefff" emissive="#bcd8ff" emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      ))}
      {/* Spielfigur (kleiner Held auf dem Boden) */}
      <mesh position={[-0.35, -0.27, 0.03]}>
        <planeGeometry args={[0.14, 0.2]} />
        <meshStandardMaterial color="#ff3b5c" emissive="#ff3b5c" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      {/* Block / Gegner */}
      <mesh position={[0.25, -0.22, 0.03]}>
        <planeGeometry args={[0.16, 0.16]} />
        <meshStandardMaterial color="#ffae00" emissive="#ffae00" emissiveIntensity={1} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Retro-CRT-Fernseher mit Antenne, Reglern und leuchtendem Screen. */
function RetroTV() {
  return (
    <group position={[0, 0.55, -0.5]}>
      {/* CRT-Rückbuckel für Tiefe */}
      <RoundedBox args={[2.3, 1.85, 1.0]} radius={0.14} smoothness={3} position={[0, 0.05, -1.0]}>
        <meshStandardMaterial {...TV_SHELL} />
      </RoundedBox>
      {/* Gehäuse */}
      <RoundedBox args={[3.0, 2.25, 1.5]} radius={0.16} smoothness={4}>
        <meshStandardMaterial {...TV_SHELL} />
      </RoundedBox>
      {/* Bildschirm-Blende */}
      <RoundedBox args={[2.4, 1.7, 0.22]} radius={0.12} smoothness={3} position={[-0.22, 0.12, 0.78]}>
        <meshStandardMaterial {...DARK_PLASTIC} />
      </RoundedBox>
      <GameScreen />

      {/* Regler rechts */}
      {[0.35, 0.0, -0.35].map((y) => (
        <mesh key={y} position={[1.12, y + 0.12, 0.82]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 18]} />
          <meshStandardMaterial color="#2a2a34" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {/* Lautsprecher rechts unten */}
      <mesh position={[1.12, -0.62, 0.82]}>
        <circleGeometry args={[0.18, 20]} />
        <meshStandardMaterial color="#1d1d26" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Standfüße */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, -1.2, 0.2]}>
          <boxGeometry args={[0.4, 0.2, 0.6]} />
          <meshStandardMaterial {...DARK_PLASTIC} />
        </mesh>
      ))}

      {/* Antenne */}
      <mesh position={[0, 1.18, -0.3]}>
        <cylinderGeometry args={[0.08, 0.12, 0.16, 16]} />
        <meshStandardMaterial color="#2a2a34" metalness={0.6} roughness={0.4} />
      </mesh>
      {[-0.7, 0.7].map((dir) => (
        <group key={dir} position={[0, 1.26, -0.3]} rotation={[0.15, 0, dir]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.018, 0.03, 1.4, 10]} />
            <meshStandardMaterial color="#c9c9d4" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, 1.42, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial {...GOLD} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Flache Retro-Konsole mit Akzent-Tasten. */
function RetroConsole() {
  return (
    <group position={[-1.5, -1.35, 0.5]} rotation={[0, 0.4, 0]}>
      <RoundedBox args={[1.7, 0.42, 1.1]} radius={0.08} smoothness={3}>
        <meshStandardMaterial {...CONSOLE_GREY} />
      </RoundedBox>
      {/* Erhöhte Mitte (Modulschacht) */}
      <RoundedBox args={[1.0, 0.16, 0.72]} radius={0.04} smoothness={2} position={[0, 0.27, 0]}>
        <meshStandardMaterial color="#a6a6b4" metalness={0.3} roughness={0.5} />
      </RoundedBox>
      {/* Schacht-Spalt */}
      <mesh position={[0, 0.36, 0]}>
        <boxGeometry args={[0.78, 0.03, 0.12]} />
        <meshStandardMaterial {...DARK_PLASTIC} />
      </mesh>
      {/* Power / Reset */}
      {[-0.55, -0.3].map((x, i) => (
        <mesh key={x} position={[x, 0.24, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
          <meshStandardMaterial color={i === 0 ? "#7c5cff" : "#ff3b5c"} metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/** SNES-artiger Controller mit D-Pad und farbigen Tasten. */
function Controller() {
  return (
    <group position={[1.3, -1.42, 1.0]} rotation={[-0.5, -0.25, 0.05]}>
      <RoundedBox args={[1.55, 0.2, 0.66]} radius={0.18} smoothness={4}>
        <meshStandardMaterial color="#d2d2dc" metalness={0.3} roughness={0.55} />
      </RoundedBox>
      {/* D-Pad */}
      <group position={[-0.42, 0.12, 0.04]}>
        <mesh>
          <boxGeometry args={[0.34, 0.06, 0.1]} />
          <meshStandardMaterial {...DARK_PLASTIC} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.1, 0.06, 0.34]} />
          <meshStandardMaterial {...DARK_PLASTIC} />
        </mesh>
      </group>
      {/* Aktionstasten (Diamant, SNES-Farben) */}
      {(
        [
          { p: [0.42, 0.12, -0.16] as Vec3, c: "#36a0ff" }, // X oben
          { p: [0.42, 0.12, 0.16] as Vec3, c: "#ffcc33" }, // B unten
          { p: [0.26, 0.12, 0.0] as Vec3, c: "#37d35a" }, // Y links
          { p: [0.58, 0.12, 0.0] as Vec3, c: "#ff3b5c" }, // A rechts
        ]
      ).map((b, i) => (
        <mesh key={i} position={b.p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.08, 18]} />
          <meshStandardMaterial color={b.c} metalness={0.35} roughness={0.4} emissive={b.c} emissiveIntensity={0.15} />
        </mesh>
      ))}
      {/* Start / Select */}
      {[-0.06, 0.12].map((x) => (
        <mesh key={x} position={[x, 0.11, 0.18]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.18, 0.05, 0.07]} />
          <meshStandardMaterial color="#3a3a46" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/** Reihe bunter Spiele-Module ("deine Sammlung"). */
function CartridgeRow() {
  const carts: { p: Vec3; rz: number; c: string }[] = [
    { p: [1.85, -0.95, 0.45], rz: 0.06, c: "#d23a4f" },
    { p: [2.2, -0.95, 0.1], rz: -0.05, c: "#2f7fe0" },
    { p: [2.5, -0.95, -0.28], rz: 0.09, c: "#37b24d" },
  ];
  return (
    <group>
      {carts.map((cart, i) => (
        <group key={i} position={cart.p} rotation={[0, 0.5, cart.rz]}>
          <RoundedBox args={[0.95, 1.1, 0.26]} radius={0.05} smoothness={2}>
            <meshStandardMaterial color={cart.c} metalness={0.2} roughness={0.5} />
          </RoundedBox>
          {/* Label */}
          <mesh position={[0, 0.18, 0.14]}>
            <planeGeometry args={[0.72, 0.5]} />
            <meshStandardMaterial color="#f0ead8" metalness={0.1} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Einzelne schwebende, rotierende Goldmünze. */
function FloatingCoin({ position, delay = 0, scale = 1 }: { position: Vec3; delay?: number; scale?: number }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime + delay;
    g.rotation.y = t * 1.6;
    g.position.y = position[1] + Math.sin(t * 1.2) * 0.18;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 30]} />
        <meshStandardMaterial {...GOLD} emissive="#7a4a00" emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

/** Kleiner Münzstapel auf der Konsole. */
function CoinStack() {
  return (
    <group position={[-1.95, -1.0, 0.85]} rotation={[0, 0, 0.04]}>
      {[0, 0.09, 0.18].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[0, y * 6, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.07, 28]} />
          <meshStandardMaterial {...GOLD} emissive="#7a4a00" emissiveIntensity={0.18} />
        </mesh>
      ))}
    </group>
  );
}

/** Glänzende Plattform mit dezentem Goldring (Casino-Vibe). */
function Platform() {
  return (
    <group position={[0, -1.75, 0]}>
      <RoundedBox args={[6, 0.25, 3]} radius={0.1} smoothness={2}>
        <meshStandardMaterial color="#0c0c14" metalness={0.6} roughness={0.32} envMapIntensity={1.2} />
      </RoundedBox>
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.035, 12, 64]} />
        <meshStandardMaterial {...GOLD} emissive="#5a3500" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/** Das gesamte Diorama inkl. weicher Maus-Parallaxe. */
function Diorama() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const targetY = state.pointer.x * 0.25;
    const targetX = -state.pointer.y * 0.12;
    g.rotation.y += (targetY - g.rotation.y) * 0.06;
    g.rotation.x += (targetX - g.rotation.x) * 0.06;
  });

  return (
    <group ref={ref} scale={0.82} position={[0, 0.1, 0]}>
      <Platform />
      <RetroTV />
      <RetroConsole />
      <CoinStack />
      <Controller />
      <CartridgeRow />
      <FloatingCoin position={[-2.3, 0.6, 0.8]} delay={0} scale={1} />
      <FloatingCoin position={[2.4, 1.0, 0.4]} delay={1.1} scale={0.85} />
      <FloatingCoin position={[-2.5, -0.7, 0.4]} delay={2.0} scale={0.9} />
      <FloatingCoin position={[1.7, 1.7, 0.1]} delay={0.6} scale={0.7} />
    </group>
  );
}

export default function HeroScene3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Render-Loop pausieren, sobald der Hero weggescrollt ist (spart GPU/CPU).
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? "always" : "never"),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0.2, 9], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        performance={{ min: 0.5 }}
        style={{ touchAction: "none" }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[0, 8, 6]} angle={0.55} penumbra={1} intensity={160} color="#fff0d0" distance={40} />
        <pointLight position={[6, 2, 5]} intensity={55} color="#ffb74d" />
        <pointLight position={[-6, -1, 4]} intensity={28} color="#22d3a3" />
        <pointLight position={[0, -2, 5]} intensity={18} color="#36e0ff" />

        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.7}>
          <Diorama />
        </Float>

        {/* Reflexionen ohne externe HDRI — aus Lichtflächen gebacken */}
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[10, 6, 1]} color="#fff2cc" />
          <Lightformer form="rect" intensity={1.4} position={[-5, 1, 3]} scale={[3, 5, 1]} color="#ffcf8a" />
          <Lightformer form="circle" intensity={2} position={[5, -1, 3]} scale={[3, 3, 1]} color="#36e0ff" />
          <Lightformer form="ring" intensity={1.2} position={[0, -3, 2]} scale={[6, 6, 1]} color="#ff9a1f" />
        </Environment>

        {/* Senkt die Render-Auflösung automatisch bei FPS-Einbrüchen */}
        <AdaptiveDpr />
      </Canvas>
    </div>
  );
}
