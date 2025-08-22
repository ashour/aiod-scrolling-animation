import type GUI from "lil-gui";
import * as THREE from "three";
import engine from "../engine";

type WorldSceneOptions = {
  environmentMap?: THREE.Texture;
  gui?: (gui: GUI, scene: THREE.Scene) => GUI;
  dispose?: () => void;
};

export function makeWorldScene(options: WorldSceneOptions = {}): WorldScene {
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

    setEnvironmentMap(
      map: THREE.Texture,
      intensity: number = 1,
      rotation: THREE.Euler = new THREE.Euler(0, 0, 0),
    ): void {
      const pmrem = new THREE.PMREMGenerator(engine.renderer.threeRenderer);
      pmrem.compileEquirectangularShader();

      let processedEnvMap: THREE.Texture = pmrem.fromEquirectangular(map).texture;

      map.dispose();
      pmrem.dispose();

      threeScene.environment = processedEnvMap;
      threeScene.environmentIntensity = intensity;
      threeScene.environmentRotation = rotation;
    },

    get environmentMapIntensity(): number {
      return threeScene.environmentIntensity;
    },

    set environmentMapIntensity(value: number) {
      threeScene.environmentIntensity = value;
    },

    get environmentMapRotation(): THREE.Euler {
      return threeScene.environmentRotation;
    },

    set environmentMapRotation(value: THREE.Euler) {
      threeScene.environmentRotation.set(value.x, value.y, value.z);
    },

    update(deltaTime: number) {
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
