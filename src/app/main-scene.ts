import engine from "@/engine";
import worldScene from "@/engine/world/world-scene";
import * as THREE from "three";
import { addEnvironmentMapDebugControls } from "./debug-environment-map";

const ENV_MAP_INTENSITY = 0.25;
const ENV_MAP_ROTATION = new THREE.Euler(0.75, 1.68, 0.59);

export function makeMainScene(): WorldScene {
  const scene = worldScene();

  scene.setEnvironmentMap(
    engine.resource<THREE.Texture>("environmentMap"),
    ENV_MAP_INTENSITY,
    ENV_MAP_ROTATION,
  );
  addEnvironmentMapDebugControls(engine.gui, scene);

  return scene;
}
