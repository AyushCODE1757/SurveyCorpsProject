"use client";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 z-0 pointer-events-none"
      options={{
        background: {
          color: { value: "transparent" },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" },
            resize: true,
          },
          modes: {
            push: { quantity: 3 },
            repulse: { distance: 100, duration: 0.4 },
          },
        },
        particles: {
          color: { value: "#fde68a" }, // Brighter glowing gold
          links: {
            color: "#fde68a", // Brighter connecting lines
            distance: 150,
            enable: true,
            opacity: 0.45, // Much brighter links (was 0.15)
            width: 1.5, // Slightly thicker lines
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: true,
            speed: 0.8,
            straight: false,
          },
          number: {
            density: { enable: true, area: 800 },
            value: 60,
          },
          opacity: {
            value: { min: 0.5, max: 0.95 }, // Brighter overall, with a pulsing effect
            animation: {
              enable: true,
              speed: 1,
              sync: false,
            },
          },
          shape: { type: "circle" },
          size: { value: { min: 1.5, max: 3.5 } }, // Made the dots slightly larger
        },
        detectRetina: true,
      }}
    />
  );
}
