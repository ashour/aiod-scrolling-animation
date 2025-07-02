import time from "@/engine/system/time";
import worldObject from "@/engine/world/worldObject";
import * as THREE from "three";

export function phone(): WorldObject {
  const _phone = new THREE.Mesh(
    new THREE.BoxGeometry(7.57, 15.09, 0.83),
    new THREE.MeshStandardMaterial({ color: "#aaaaaa" }),
  );

  _phone.position.set(1, -3, 4.3);
  _phone.rotation.set(-3.5, 0.4, 0.2);

  const baseY = _phone.position.y;
  const baseRotationX = _phone.rotation.x;
  const baseRotationZ = _phone.rotation.z;

  return worldObject(_phone, {
    update(_deltaTime: number) {
      _phone.position.y = baseY + Math.sin(time.elapsedTime * 1.5) * 0.25;
      _phone.rotation.x = baseRotationX + Math.sin(time.elapsedTime * 1.25) * 0.0625;
      _phone.rotation.z = baseRotationZ + Math.sin(time.elapsedTime * 0.45) * 0.03125;
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
  });
}
