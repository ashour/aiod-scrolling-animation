import { perspectiveCamera } from "@/engine/rendering/camera";
import { browserWindow } from "@/engine/system/browser_window";
import worldObject from "@/engine/world/world-object";
import * as THREE from "three";

const FOV = 35;
const NEAR_CLIPPING_PLANE = 0.1;
const FAR_CLIPPING_PLANE = 100;
const POSITION = new THREE.Vector3(0, 0, 70);

export function makeMainCamera(): WorldCamera {
  const mainCamera = perspectiveCamera({
    fov: FOV,
    aspect: browserWindow.width / browserWindow.height,
    near: NEAR_CLIPPING_PLANE,
    far: FAR_CLIPPING_PLANE,
    position: POSITION,
  });

  return worldObject(mainCamera!.threeObject, {
    setAspect(newAspect: number) {
      mainCamera!.setAspect(newAspect);
    },

    gui(gui) {
      const folder = gui.addFolder("Camera");

      folder.add(mainCamera.threeObject.position, "x").min(-1000).max(1000).step(0.1).name("posX");
      folder.add(mainCamera.threeObject.position, "y").min(-1000).max(1000).step(0.1).name("posY");
      folder.add(mainCamera.threeObject.position, "z").min(-1000).max(1000).step(0.1).name("posZ");

      folder.close();

      return folder;
    },
  });
}
