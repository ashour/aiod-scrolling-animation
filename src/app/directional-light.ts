import type GUI from "lil-gui";
import * as THREE from "three";
import worldObject from "../engine/world/world-object";

const COLOR = "#FFFFFF";
const INTENSITY = 0.1;
const POSITION = new THREE.Vector3(0, 30, 10);

export function makeDirectionalLight(): WorldObject {
  const light = new THREE.DirectionalLight(COLOR, INTENSITY);
  light.position.copy(POSITION);

  return worldObject(light, {
    gui(gui: GUI) {
      const folder = gui.addFolder("Directional Light");

      folder.addColor(light, "color");
      folder.add(light, "intensity").min(-20).max(20).step(0.001);

      folder.add(light.position, "x").min(-50).max(50).step(0.001).name("posX");
      folder.add(light.position, "y").min(-50).max(50).step(0.001).name("posY");
      folder.add(light.position, "z").min(-50).max(50).step(0.001).name("posZ");

      folder.close();

      return folder;
    },
  });
}
