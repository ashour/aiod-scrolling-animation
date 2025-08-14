import type GUI from "lil-gui";
import * as THREE from "three";
import worldObject from "../engine/world/world-object";

export function directionalLight(): WorldObject {
  const light = new THREE.DirectionalLight("#ffffff", 0.4);
  light.position.set(0, 0, 5);

  return worldObject(light, {
    gui(gui: GUI) {
      const folder = gui.addFolder("Light");
      folder.add(light, "intensity").min(0).max(10).step(0.001).name("lightIntensity");
      folder.add(light.position, "x").min(-5).max(5).step(0.001).name("lightX");
      folder.add(light.position, "y").min(-5).max(5).step(0.001).name("lightY");
      folder.add(light.position, "z").min(-5).max(5).step(0.001).name("lightZ");
      return folder;
    },
  });
}
