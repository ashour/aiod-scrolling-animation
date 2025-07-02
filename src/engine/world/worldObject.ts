import type GUI from "lil-gui";
import * as THREE from "three";
import engine from "../engine";

type WorldObjectOptions = {
  update?: (deltaTime: number) => void;
  gui?: (gui: GUI) => GUI;
  dispose?: () => void;
};

export default function worldObject(
  threeObject: THREE.Object3D,
  options: WorldObjectOptions = {},
): WorldObject {
  const gui = options.gui ? options.gui(engine.gui) : null;

  return {
    threeObject,
    update(deltaTime: number) {
      if (options.update) {
        options.update(deltaTime);
      }
    },
    dispose() {
      if (options.dispose) {
        options.dispose();
      }
      gui?.destroy();
    },
  };
}
