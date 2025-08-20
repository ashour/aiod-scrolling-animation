import type GUI from "lil-gui";
import * as THREE from "three";
import worldObject from "../engine/world/world-object";

export function makeAmbientLight(): WorldObject {
  const light = new THREE.AmbientLight("#fde597", 0.5);
  light.position.set(0, 0, 0);

  return worldObject(light, {
    gui(gui: GUI) {
      const folder = gui.addFolder("Ambient Light");
      folder.add(light, "intensity").min(-500).max(500).step(0.001).name("lightIntensity");
      folder.add(light.position, "x").min(-50).max(50).step(0.001).name("lightX");
      folder.add(light.position, "y").min(-50).max(50).step(0.001).name("lightY");
      folder.add(light.position, "z").min(-50).max(50).step(0.001).name("lightZ");
      return folder;
    },
  });
}
