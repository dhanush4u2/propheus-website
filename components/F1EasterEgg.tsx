"use client";

import { useEffect } from "react";

export default function F1EasterEgg() {
  useEffect(() => {
    const secretCode = "MAXVERSTAPPEN";
    let inputBuffer = "";
    let animationInterval: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys to prevent interfering with shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const char = e.key.toUpperCase().replace(/\s/g, "");
      // Only add single characters to the buffer
      if (!char || char.length !== 1) return;

      inputBuffer += char;

      // Keep buffer length to at most the secret code length
      if (inputBuffer.length > secretCode.length) {
        inputBuffer = inputBuffer.slice(-secretCode.length);
      }

      if (inputBuffer === secretCode) {
        triggerEasterEggAudio();
        inputBuffer = ""; // Reset after trigger
      }
    };

    const triggerEasterEggAudio = () => {
      // Play audio
      const audio = new Audio("/donottouch.mp3");
      audio.play().catch((err) => {
        console.warn("Autoplay blocked for F1 Easter Egg audio:", err);
      });
    };

    // --- Start Console Animation Automatically ---
    let position = 50;
    const trackLength = 50;

    animationInterval = setInterval(() => {
      console.clear();
      const spaces = " ".repeat(position);
      const engine = "🏎️💨";
      
      console.log(`%c${spaces}${engine}`, "font-size: 24px;");
      console.log(
        "%cmade by dhanush",
        "color: #666; font-size: 11px; font-style: italic; opacity: 0.5;"
      );

      position -= 1;
      if (position < 0) {
        position = trackLength;
      }
    }, 100);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (animationInterval) clearInterval(animationInterval);
    };
  }, []);

  return null;
}
