import engine from "@/engine";
import time from "@/engine/system/time";
import worldObject from "@/engine/world/worldObject";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

type PhoneProps = {
  isFloating: () => boolean;
  toggleFloat: (enable: boolean) => void;
};

export function phone(): WorldObject<PhoneProps> {
  let _isFloatingEnabled: boolean = true;

  const _gltf = engine.resource<GLTF>("phoneModel");
  const _phone = _gltf.scene;

  _phone.scale.set(80, 80, 80);
  _phone.position.set(1, -3, 4.3);
  _phone.rotation.set(0.2, 1.1, 0.9);

  const _mixer = new THREE.AnimationMixer(_phone);

  let _baseY = _phone.position.y;
  let _baseRotationX = _phone.rotation.x;
  let _baseRotationZ = _phone.rotation.z;

  return worldObject(_phone, {
    update(deltaTime: number) {
      _mixer.update(deltaTime);

      if (!_isFloatingEnabled) {
        return;
      }
      //todo might want to interpolate these the when floating is enabled
      _phone.position.y = _baseY + Math.sin(time.elapsedTime * 1.5) * 0.25;
      _phone.rotation.x = _baseRotationX + Math.sin(time.elapsedTime * 1.25) * 0.0625;
      _phone.rotation.z = _baseRotationZ + Math.sin(time.elapsedTime * 0.45) * 0.03125;
    },

    gui(gui) {
      const folder = gui.addFolder("Phone");
      folder.add(_phone.position, "x").min(-10).max(10).step(0.1).name("posX");
      folder.add(_phone.position, "y").min(-10).max(10).step(0.1).name("posY");
      folder.add(_phone.position, "z").min(-10).max(10).step(0.1).name("posZ");
      folder.add(_phone.rotation, "x").min(-10).max(10).step(0.1).name("rotX");
      folder.add(_phone.rotation, "y").min(-10).max(10).step(0.1).name("rotY");
      folder.add(_phone.rotation, "z").min(-10).max(10).step(0.1).name("rotZ");
      folder.add(this, "playAnimations");
      return folder;
    },

    isFloating() {
      return _isFloatingEnabled;
    },

    toggleFloat(enable: boolean) {
      _isFloatingEnabled = enable;
      if (_isFloatingEnabled) {
        _baseY = _phone.position.y;
        _baseRotationX = _phone.rotation.x;
        _baseRotationZ = _phone.rotation.z;
      }
    },

    playAnimations() {
      _gltf.animations.forEach((clip) => {
        const action = _mixer.clipAction(clip);
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
      });
    },
  });
}
