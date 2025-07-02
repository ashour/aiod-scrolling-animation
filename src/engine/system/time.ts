import * as THREE from "three";

const _clock = new THREE.Clock();

let _previousElapsedTime = 0;

// Avoid zero delta time in case it's accessed
// before the first time it's calculated.
let _deltaTime = 0.016;

export default {
  get currentTime() {
    return Date.now();
  },
  get deltaTime() {
    return _deltaTime;
  },
  get elapsedTime() {
    return _clock.getElapsedTime();
  },

  update() {
    const elapsedTime = this.elapsedTime;
    _deltaTime = elapsedTime - _previousElapsedTime;
    _previousElapsedTime = elapsedTime;
  },
};
