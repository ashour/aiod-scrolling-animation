import * as THREE from "three";

const clock = new THREE.Clock();

let previousElapsedTime = 0;

// Avoid zero delta time in case it's accessed
// before the first time it's calculated.
let deltaTime = 0.016;

export default {
  get currentTime() {
    return Date.now();
  },
  get deltaTime() {
    return deltaTime;
  },
  get elapsedTime() {
    return clock.getElapsedTime();
  },

  update() {
    const elapsedTime = this.elapsedTime;
    deltaTime = elapsedTime - previousElapsedTime;
    previousElapsedTime = elapsedTime;
  },
};
