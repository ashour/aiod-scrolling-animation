import time from "@/engine/system/time";
import worldObject from "@/engine/world/worldObject";
import * as THREE from "three";

type PhoneProps = {
  isFloating: () => boolean;
  toggleFloat: (enable: boolean) => void;
};

export function phone(): WorldObject<PhoneProps> {
  let _isFloatingEnabled: boolean = true;

  const _phone = new THREE.Mesh(
    new THREE.BoxGeometry(7.57, 15.09, 0.83),
    new THREE.MeshStandardMaterial({ color: "#aaaaaa" }),
  );

  _phone.position.set(1, -3, 4.3);
  _phone.rotation.set(-3.5, 0.4, 0.2);

  let _baseY = _phone.position.y;
  let _baseRotationX = _phone.rotation.x;
  let _baseRotationZ = _phone.rotation.z;

  return worldObject(_phone, {
    update(_deltaTime: number) {
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
      folder.add(_phone.rotation, "x").min(-10).max(10).step(0.1);
      folder.add(_phone.rotation, "y").min(-10).max(10).step(0.1);
      folder.add(_phone.rotation, "z").min(-10).max(10).step(0.1);
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
  });
}
