// "use client";
// import { useCallback } from "react";
// import Particles from "react-tsparticles";
// import { loadSlim } from "tsparticles-slim";

// export default function ParticleBackground() {
//   const particlesInit = useCallback(async (engine) => {
//     // loadSlim ensures we only load the features we need, keeping the bundle small
//     await loadSlim(engine);
//   }, []);

//   return (
//     <Particles
//       id="tsparticles"
//       init={particlesInit}
//       className="absolute inset-0 z-0"
//       options={{
//         background: {
//           color: { value: "transparent" },
//         },
//         fpsLimit: 120,
//         interactivity: {
//           events: {
//             onClick: { enable: true, mode: "push" },
//             onHover: { enable: true, mode: "repulse" }, // Pushes particles away from mouse
//             resize: true,
//           },
//           modes: {
//             push: { quantity: 3 },
//             repulse: { distance: 100, duration: 0.4 },
//           },
//         },
//         particles: {
//           color: { value: "#fbbf24" }, // Your gold-400 theme color
//           links: {
//             color: "#fbbf24",
//             distance: 150,
//             enable: true,
//             opacity: 0.15, // Subtle connection lines
//             width: 1,
//           },
//           move: {
//             direction: "none",
//             enable: true,
//             outModes: { default: "bounce" },
//             random: true,
//             speed: 0.8, // Slow, premium floating speed
//             straight: false,
//           },
//           number: {
//             density: { enable: true, area: 800 },
//             value: 60, // Amount of particles
//           },
//           opacity: { value: 0.4 },
//           shape: { type: "circle" },
//           size: { value: { min: 1, max: 2.5 } },
//         },
//         detectRetina: true,
//       }}
//     />
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { loadSlim } from "@tsparticles/slim";

// export default function ParticleBackground() {
//   const [init, setInit] = useState(false);

//   // This is the new v3 way to initialize the engine securely
//   useEffect(() => {
//     initParticlesEngine(async (engine) => {
//       await loadSlim(engine);
//     }).then(() => {
//       setInit(true);
//     });
//   }, []);

//   if (!init) return null;

//   return (
//     <Particles
//       id="tsparticles"
//       className="absolute inset-0 z-0 pointer-events-none"
//       options={{
//         background: {
//           color: { value: "transparent" },
//         },
//         fpsLimit: 120,
//         interactivity: {
//           events: {
//             onClick: { enable: true, mode: "push" },
//             onHover: { enable: true, mode: "repulse" },
//             resize: true,
//           },
//           modes: {
//             push: { quantity: 3 },
//             repulse: { distance: 100, duration: 0.4 },
//           },
//         },
//         particles: {
//           color: { value: "#fbbf24" }, // Gold color
//           links: {
//             color: "#fbbf24",
//             distance: 150,
//             enable: true,
//             opacity: 0.15,
//             width: 1,
//           },
//           move: {
//             direction: "none",
//             enable: true,
//             outModes: { default: "bounce" },
//             random: true,
//             speed: 0.8, // Slow, premium floating speed
//             straight: false,
//           },
//           number: {
//             density: { enable: true, area: 800 },
//             value: 60,
//           },
//           opacity: { value: 0.4 },
//           shape: { type: "circle" },
//           size: { value: { min: 1, max: 2.5 } },
//         },
//         detectRetina: true,
//       }}
//     />
//   );
// }

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
