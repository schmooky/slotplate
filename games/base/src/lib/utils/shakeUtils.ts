import { gsap } from 'gsap/all';
import { Container } from 'pixi.js';

export const shakeContainer = (
  container: Container,
  intensity = 15,
  duration = 0.4,
  shakeCount = 3,
): gsap.core.Timeline => {
  const originalX = container.x;
  const originalY = container.y;
  const shakeTimeline = gsap.timeline();

  const shakes = [];

  for (let index = 0; index < shakeCount; index += 1) {
    shakes.push({
      x: originalX + Math.random() * intensity * 2 - intensity,
      y: originalY + Math.random() * intensity * 2 - intensity,
      duration: duration / shakeCount,
    });
  }

  shakes.push({
    x: originalX,
    y: originalY,
    duration: duration / shakeCount,
  });

  shakeTimeline.to(container, {
    duration,
    ease: 'none',
    keyframes: shakes,
    onComplete: () => {
      container.x = originalX;
      container.y = originalY;
    },
  });

  return shakeTimeline;
};

export const anticipationShake = (container: Container) => {
  shakeContainer(container, 4, 1, 55);

  gsap.to(container.scale, {
    duration: 0.95,
    x: 1.02,
    y: 1.02,
    onComplete: () => {
      gsap.to(container.scale, {
        duration: 0.025,
        x: 1,
        y: 1,
      });
    },
  });
};

export const fsBonusShake = (container: Container): gsap.core.Timeline => shakeContainer(container, 5, 0.2, 5);
export const wildShake = (container: Container): gsap.core.Timeline => shakeContainer(container, 5, 0.3, 10);
