import engine from "@/engine";
import { makeWorldScene } from "@/engine/world/world-scene";
import type GUI from "lil-gui";
import * as THREE from "three";

const ENV_MAP_INTENSITY = 0.25;
const ENV_MAP_ROTATION = new THREE.Euler(0.75, 1.68, 0.59);
const INIT_DEBUG_FOLDER_OPEN = false;

export function makeMainScene(): WorldScene {
  const scene = makeWorldScene();

  scene.setEnvironmentMap(
    engine.resource<THREE.Texture>("environmentMap"),
    ENV_MAP_INTENSITY,
    ENV_MAP_ROTATION,
  );

  addDebugControls(engine.gui, scene);

  return scene;
}

export function addDebugControls(gui: GUI, scene: WorldScene) {
  const controls = gui.addFolder("Environment Map");

  controls.add(scene, "environmentMapIntensity", 0, 2, 0.01).name("Intensity");

  controls.add(scene.environmentMapRotation, "x", -Math.PI, Math.PI, 0.01).name("Rotation X");
  controls.add(scene.environmentMapRotation, "y", -Math.PI, Math.PI, 0.01).name("Rotation Y");
  controls.add(scene.environmentMapRotation, "z", -Math.PI, Math.PI, 0.01).name("Rotation Z");

  if (INIT_DEBUG_FOLDER_OPEN) {
    controls.open();
  } else {
    controls.close();
  }
}
