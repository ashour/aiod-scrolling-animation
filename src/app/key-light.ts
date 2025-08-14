import type GUI from "lil-gui";
import * as THREE from "three";
import worldObject from "../engine/world/world-object";

export function keyLight(): WorldObject {
  const light = new THREE.DirectionalLight("#FFFFAD", 0.1);
  light.position.set(-25, 8, 50);

  return worldObject(light, {
    gui(gui: GUI) {
      const folder = gui.addFolder("Key Light");
      folder.add(light, "intensity").min(-500).max(500).step(0.001).name("lightIntensity");
      folder.add(light.position, "x").min(-50).max(50).step(0.001).name("lightX");
      folder.add(light.position, "y").min(-50).max(50).step(0.001).name("lightY");
      folder.add(light.position, "z").min(-50).max(50).step(0.001).name("lightZ");
      return folder;
    },
  });
}
