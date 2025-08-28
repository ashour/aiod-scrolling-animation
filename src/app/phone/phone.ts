import engine from "@/engine";
import { makeWorldObject } from "@/engine/world/world-object";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { makeFloatingBehavior } from "./floating-behavior";
import { makeBackgroundHalo } from "./halo/background-halo";

const POSITION = new THREE.Vector3(-0.1, 3, 20);
const ROTATION = new THREE.Euler(-0.1, -0.3, -0.1);

const FRAME_RANGES = {
  0: { start: 0, end: 12 },
  1: { start: 12, end: 15 },
};

type PhoneProps = {
  setAnimationTime: (clipIndex: number, normalizedTime: number) => void;
  startFloating: () => void;
  stopFloating: () => void;
};

export function makePhone(): WorldObject<PhoneProps> {
  const gltf = engine.resource<GLTF>("phoneModel");
  const phone = gltf.scene;

  phone.position.copy(POSITION);
  phone.rotation.copy(ROTATION);

  const halo = makeBackgroundHalo();
  phone.add(halo.threeObject);
  halo.threeObject.position.set(0, 0, -1);

  const mixer = new THREE.AnimationMixer(phone);
  const floating = makeFloatingBehavior(phone);

  return makeWorldObject(phone, {
    gui(gui) {
      const folder = gui.addFolder("Phone");

      folder.add(phone.position, "x").min(-10).max(10).step(0.1).name("posX");
      folder.add(phone.position, "y").min(-10).max(10).step(0.1).name("posY");
      folder.add(phone.position, "z").min(-10).max(10).step(0.1).name("posZ");

      folder.add(phone.rotation, "x").min(-10).max(10).step(0.1).name("rotX");
      folder.add(phone.rotation, "y").min(-10).max(10).step(0.1).name("rotY");
      folder.add(phone.rotation, "z").min(-10).max(10).step(0.1).name("rotZ");

      folder.close();

      return folder;
    },

    setAnimationTime(rangeIndex: number, normalizedTime: number) {
      const range = FRAME_RANGES[rangeIndex as keyof typeof FRAME_RANGES];
      if (!range) {
        return;
      }

      const clip = gltf.animations[0];
      const totalDuration = clip.duration;
      const frameDuration = totalDuration / 15;

      const startTime = range.start * frameDuration;
      const endTime = range.end * frameDuration;
      const animationTime = startTime + normalizedTime * (endTime - startTime);

      const action = mixer.clipAction(clip);
      action.play();
      action.time = animationTime;
      mixer.update(0);
    },

    startFloating() {
      floating.start();
    },

    stopFloating() {
      floating.stop();
    },
  });
}
