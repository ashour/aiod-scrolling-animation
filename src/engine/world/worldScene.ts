import type GUI from "lil-gui";
import * as THREE from "three";
import engine from "../engine";

type WorldSceneOptions = {
  environmentMap?: THREE.Texture;
  gui?: (gui: GUI, scene: THREE.Scene) => GUI;
  dispose?: () => void;
};

export default function worldScene(options: WorldSceneOptions = {}): WorldScene {
  const threeScene = new THREE.Scene();
  if (options.environmentMap) {
    options.environmentMap.dispose();
    threeScene.environment = options.environmentMap;
  }

  const gui = options.gui ? options.gui(engine.gui, threeScene) : null;

  const objects: WorldObject[] = [];

  return {
    threeScene,
    threeObject: threeScene,

    add(object: WorldObject) {
      objects.push(object);
      threeScene.add(object.threeObject);
    },

    update(deltaTime) {
      for (const object of objects) {
        if (object.update) {
          object.update(deltaTime);
        }
      }
    },

    dispose() {
      if (options.dispose) {
        options.dispose();
      }

      gui?.destroy();

      objects.forEach((object) => {
        return object.dispose();
      });

      threeScene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();

          for (const key in child.material) {
            const value = child.material[key];
            if (value && typeof value.dispose === "function") {
              value.dispose();
            }
          }
          child.material.dispose();
        }
      });

      while (threeScene.children.length > 0) {
        threeScene.remove(threeScene.children[0]);
      }
    },
  };
}
