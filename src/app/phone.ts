import engine from "@/engine";
import worldObject from "@/engine/world/world-object";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { backgroundHalo } from "./background-halo";

type PhoneProps = {
  updateAnimationInLoop: (update: boolean) => void;
  setAnimationTime: (clipIndex: number, normalizedTime: number) => void;
};

const _frameRanges = {
  0: { start: 0, end: 12 },
  1: { start: 12, end: 15 },
};

export function phone(): WorldObject<PhoneProps> {
  let _updatesAnimationsInLoop: boolean = false;

  const _gltf = engine.resource<GLTF>("phoneModel");
  const _phone = _gltf.scene;

  console.log(_gltf);

  _phone.position.set(1, -3, 4.3);
  _phone.rotation.set(-0.1, -0.3, -0.1);

  const _halo = backgroundHalo();
  _phone.add(_halo.threeObject);
  _halo.threeObject.position.set(0, 0, -1);

  const _mixer = new THREE.AnimationMixer(_phone);

  const _debug = {
    playAnimations() {
      _updatesAnimationsInLoop = true;
      _gltf.animations.forEach((clip) => {
        const action = _mixer.clipAction(clip);
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
      });
    },
  };

  return worldObject(_phone, {
    update(deltaTime: number) {
      if (_updatesAnimationsInLoop) {
        _mixer.update(deltaTime);
      }
    },

    gui(gui) {
      const folder = gui.addFolder("Phone");
      folder.add(_phone.position, "x").min(-10).max(10).step(0.1).name("posX");
      folder.add(_phone.position, "y").min(-10).max(10).step(0.1).name("posY");
      folder.add(_phone.position, "z").min(-10).max(10).step(0.1).name("posZ");
      folder.add(_phone.rotation, "x").min(-10).max(10).step(0.1).name("rotX");
      folder.add(_phone.rotation, "y").min(-10).max(10).step(0.1).name("rotY");
      folder.add(_phone.rotation, "z").min(-10).max(10).step(0.1).name("rotZ");
      folder.add(_debug, "playAnimations");
      return folder;
    },

    updateAnimationInLoop(update: boolean) {
      _updatesAnimationsInLoop = update;
    },

    setAnimationTime(rangeIndex: number, normalizedTime: number) {
      const range = _frameRanges[rangeIndex as keyof typeof _frameRanges];
      if (!range) {
        return;
      }

      const clip = _gltf.animations[0];
      const totalDuration = clip.duration;
      const frameDuration = totalDuration / 15;

      const startTime = range.start * frameDuration;
      const endTime = range.end * frameDuration;
      const animationTime = startTime + normalizedTime * (endTime - startTime);

      const action = _mixer.clipAction(clip);
      action.play();
      action.time = animationTime;
      _mixer.update(0);
    },
  });
}
