import worldObject from "@/engine/world/world-object";
import type GUI from "lil-gui";
import * as THREE from "three";

const COLOR = "#fde597";
const INTENSITY = 0.5;

export function makeAmbientLight(): WorldObject {
  const light = new THREE.AmbientLight(COLOR, INTENSITY);

  return worldObject(light, {
    gui(gui: GUI) {
      const folder = gui.addFolder("Ambient Light");
      folder.addColor(light, "color");
      folder.add(light, "intensity").min(-20).max(20).step(0.001);
      folder.close();
      return folder;
    },
  });
}
