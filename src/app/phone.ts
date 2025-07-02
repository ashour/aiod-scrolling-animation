import worldObject from "@/engine/world/worldObject";
import * as THREE from "three";

export function phone(): WorldObject {
  const _phone = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.5, 0.125),
    new THREE.MeshStandardMaterial({ color: "#aaaaaa" }),
  );

  return worldObject(_phone, {
    update(deltaTime: number) {
      _phone.rotation.x += 1.25 * deltaTime;
    },
  });
}
