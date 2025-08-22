import gsap from "gsap";
import * as THREE from "three";

export function makeFloatingBehavior(target: THREE.Object3D) {
  const positionTween = gsap.to(target.position, {
    y: "+=0.5",
    duration: 2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    paused: true,
  });
  const rotationTween = gsap.to(target.rotation, {
    x: "+=0.0625",
    z: "+=0.03125",
    duration: 3,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    paused: true,
  });

  return {
    start() {
      positionTween.resume();
      rotationTween.resume();
    },

    stop() {
      positionTween.pause();
      rotationTween.pause();
    },
  };
}
