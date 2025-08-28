import { fitCameraToBox, makePerspectiveCamera } from "@/engine/rendering/camera";
import { makeWorldObject } from "@/engine/world/world-object";
import * as THREE from "three";
import { canvasContainerSize } from "./canvas-size";

const FOV = 35;
const NEAR_CLIPPING_PLANE = 0.1;
const FAR_CLIPPING_PLANE = 100;

const POSITION = new THREE.Vector3(0, 0, 70);

const FITTING_BOX_SIZE = 7;
const FITTING_PADDING = 1.05;
const FITTING_WIDE_ASPECT_THRESHOLD = 1.6;
const FITTING_WIDE_FILL_Y = 0.6;

export function makeMainCamera(fittingBoxPosition: THREE.Vector3): WorldCamera {
  const { width, height } = canvasContainerSize();
  const aspect = width / height;

  const mainCamera = makePerspectiveCamera({
    fov: FOV,
    aspect,
    near: NEAR_CLIPPING_PLANE,
    far: FAR_CLIPPING_PLANE,
    position: POSITION,
  });

  const fittingBox = new THREE.Box3(
    new THREE.Vector3(-FITTING_BOX_SIZE, -FITTING_BOX_SIZE, -FITTING_BOX_SIZE),
    new THREE.Vector3(FITTING_BOX_SIZE, FITTING_BOX_SIZE, FITTING_BOX_SIZE),
  );
  fittingBox.translate(fittingBoxPosition);
  fitCameraToBox(mainCamera.threeObject as THREE.PerspectiveCamera, fittingBox, {
    prefer: aspect > FITTING_WIDE_ASPECT_THRESHOLD ? "width" : "contain",
    fillY: FITTING_WIDE_FILL_Y,
    padding: FITTING_PADDING,
  });

  return makeWorldObject(mainCamera.threeObject, {
    setAspect(newAspect: number) {
      mainCamera.setAspect(newAspect);
      fitCameraToBox(mainCamera.threeObject as THREE.PerspectiveCamera, fittingBox, {
        prefer: newAspect > FITTING_WIDE_ASPECT_THRESHOLD ? "width" : "contain",
        fillY: FITTING_WIDE_FILL_Y,
        padding: FITTING_PADDING,
      });
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
