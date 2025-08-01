import engine from "@/engine";
import worldObject from "@/engine/world/worldObject";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

type PhoneProps = {
  updateAnimationInLoop: (update: boolean) => void;
  setAnimationTime: (normalizedTime: number) => void;
};

export function phone(): WorldObject<PhoneProps> {
  let _updatesAnimationsInLoop: boolean = false;

  const _gltf = engine.resource<GLTF>("phoneModel");
  const _phone = _gltf.scene;

  console.log(_gltf);

  _phone.position.set(1, -3, 4.3);
  _phone.rotation.set(-0.1, -3.3, 0.2);

  const _mixer = new THREE.AnimationMixer(_phone);

  let _baseY = _phone.position.y;
  let _baseRotationX = _phone.rotation.x;
  let _baseRotationZ = _phone.rotation.z;

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

    setAnimationTime(normalizedTime: number) {
      const duration = _gltf.animations[0].duration;
      _gltf.animations.forEach((clip) => {
        const action = _mixer.clipAction(clip);
        action.play();
        action.time = normalizedTime * duration;
      });
      _mixer.update(0);
    },
  });
}
