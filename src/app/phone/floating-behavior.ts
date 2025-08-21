import gsap from "gsap";
import * as THREE from "three";

export function makeFloatingBehavior(target: THREE.Vector3) {
  let floatingTween: gsap.core.Tween | null = null;
  let rotationTween: gsap.core.Tween | null = null;

  return {
    start() {
      if (floatingTween) {
        floatingTween.kill();
      }
      if (rotationTween) {
        rotationTween.kill();
      }

      floatingTween = gsap.to(target, {
        y: "+=0.5",
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      rotationTween = gsap.to(target, {
        x: "+=0.0625",
        z: "+=0.03125",
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },

    stop() {
      if (floatingTween) {
        floatingTween.kill();
        floatingTween = null;
      }
      if (rotationTween) {
        rotationTween.kill();
        rotationTween = null;
      }
    },
  };
}
