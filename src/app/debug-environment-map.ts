import type GUI from "lil-gui";

const INIT_FOLDER_OPEN = false;

export function addEnvironmentMapDebugControls(gui: GUI, scene: WorldScene) {
  const controls = gui.addFolder("Environment Map");

  controls.add(scene, "environmentMapIntensity", 0, 2, 0.01).name("Intensity");

  controls.add(scene.environmentMapRotation, "x", -Math.PI, Math.PI, 0.01).name("Rotation X");
  controls.add(scene.environmentMapRotation, "y", -Math.PI, Math.PI, 0.01).name("Rotation Y");
  controls.add(scene.environmentMapRotation, "z", -Math.PI, Math.PI, 0.01).name("Rotation Z");

  if (INIT_FOLDER_OPEN) {
    controls.open();
  } else {
    controls.close();
  }
}
