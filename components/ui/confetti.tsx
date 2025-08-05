'use client';

import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface ConfettiProps {
  duration?: number;
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
}

export function Confetti({ 
  duration = 3000,
  particleCount = 100,
  spread = 70,
  origin = { x: 0.5, y: 0.5 }
}: ConfettiProps) {
  useEffect(() => {
    // Single burst instead of continuous
    confetti({
      particleCount,
      spread,
      origin,
      colors: ['#003825', '#004b34', '#d4a017', '#FFD700', '#FFA500'],
      ticks: 200,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
    });
  }, [duration, particleCount, spread, origin]);

  return null;
}

export function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#003825', '#004b34', '#d4a017', '#FFD700', '#FFA500'],
  };

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}