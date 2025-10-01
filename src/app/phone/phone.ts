import { LARGE_SCREEN_BREAKPOINT_PX } from "@/config/app";
import engine from "@/engine";
import { browserWindow } from "@/engine/system/browser-window";
import { makeWorldObject } from "@/engine/world/world-object";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { makeBackgroundHalo } from "./halo/background-halo";

const DEFAULT_POSITION = new THREE.Vector3(-0.1, 5, 20);
const LARGE_SCREEN_POSITION = new THREE.Vector3(6, 2, 22);
const ROTATION = new THREE.Euler(-0.1, -0.3, -0.1);

const TOTAL_FRAME_COUNT = 26;
const FRAME_RANGES = {
  0: { start: 0, end: 13 },
  1: { start: 13, end: 26 },
};

type PhoneProps = {
  setAnimationTime: (clipIndex: number, normalizedTime: number) => void;
};

export function makePhone(): WorldObject<PhoneProps> {
  const gltf = engine.resource<GLTF>("phoneModel");
  const phone = gltf.scene;

  engine.onWindowResize(() => {
    phone.position.copy(responsivePosition());
    // todo set last rotation?
    // phone.rotation.copy(ROTATION);
  });
  phone.position.copy(responsivePosition());
  phone.rotation.copy(ROTATION);

  const halo = makeBackgroundHalo();
  phone.add(halo.threeObject);
  halo.threeObject.position.set(0, 0, -1);

  const mixer = new THREE.AnimationMixer(phone);

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
      const frameDuration = totalDuration / TOTAL_FRAME_COUNT;

      const startTime = range.start * frameDuration;
      const endTime = range.end * frameDuration;
      const animationTime = startTime + normalizedTime * (endTime - startTime);

      const action = mixer.clipAction(clip);
      action.play();
      action.time = animationTime;
      mixer.update(0);
    },
  });
}

function responsivePosition() {
  return browserWindow.mediaQueryMatches(`(min-width: ${LARGE_SCREEN_BREAKPOINT_PX}px)`)
    ? LARGE_SCREEN_POSITION
    : DEFAULT_POSITION;
}
