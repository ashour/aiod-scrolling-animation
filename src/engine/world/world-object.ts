import * as THREE from "three";
import engine from "../engine";

export default function worldObject<T = {}>(
  threeObject: THREE.Object3D,
  options: WorldObjectOptions<T>,
): WorldObject<T> {
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
    ...(options || {}),
  };
}
