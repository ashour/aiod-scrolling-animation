import GUI from "lil-gui";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import engine from "../engine/engine";
import worldObject from "../engine/world/worldObject";

type FoxProps = {
  updateAnimationInLoop: (update: boolean) => void;
  setAnimationTime: (normalizedTime: number) => void;
};

export default function fox(): WorldObject<FoxProps> {
  const gltf = engine.resource<GLTF>("foxModel");
  const model = gltf.scene;
  model.scale.set(0.125, 0.125, 0.125);
  model.position.set(0, -4, 0);

  model.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      child.castShadow = true;
    }
  });

  const mixer = new THREE.AnimationMixer(model);
  let currentAnimation = mixer.clipAction(gltf.animations[1]);
  currentAnimation.play();

  let _willUpdateAnimationInLoop: boolean = false;

  const debug = {
    playIdle: () => {
      currentAnimation = crossFade(gltf, mixer, currentAnimation, 0);
    },
    playWalking: () => {
      currentAnimation = crossFade(gltf, mixer, currentAnimation, 1);
    },
    playRunning: () => {
      currentAnimation = crossFade(gltf, mixer, currentAnimation, 2);
    },
  };

  return worldObject(model, {
    gui(gui: GUI) {
      const folder = gui.addFolder("Fox");
      folder.add(debug, "playIdle").name("idle animation");
      folder.add(debug, "playWalking").name("walking animation");
      folder.add(debug, "playRunning").name("running animation");
      return folder;
    },

    update(deltaTime: number): void {
      if (!_willUpdateAnimationInLoop) {
        return;
      }
      mixer.update(deltaTime);
    },

    dispose() {
      mixer.stopAllAction();
    },

    updateAnimationInLoop(update: boolean) {
      _willUpdateAnimationInLoop = update;
    },

    setAnimationTime(normalizedTime) {
      const duration = currentAnimation.getClip().duration;
      currentAnimation.time = normalizedTime * duration;
      mixer.update(0);
    },
  });
}

function crossFade(
  gltf: GLTF,
  mixer: THREE.AnimationMixer,
  from: THREE.AnimationAction,
  toIndex: number,
): THREE.AnimationAction {
  const newAnimation = mixer.clipAction(gltf.animations[toIndex]);
  newAnimation.reset();
  newAnimation.play();
  newAnimation.crossFadeFrom(from, 1);

  return newAnimation;
}
