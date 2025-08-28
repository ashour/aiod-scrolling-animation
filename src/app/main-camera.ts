import { makePerspectiveCamera } from "@/engine/rendering/camera";
import { makeWorldObject } from "@/engine/world/world-object";
import * as THREE from "three";
import { canvasContainerSize } from "./canvas-size";

const FOV = 35;
const NEAR_CLIPPING_PLANE = 0.1;
const FAR_CLIPPING_PLANE = 100;
const NARROW_ZOOM = 63;
const WIDE_ZOOM = 70;

export function makeMainCamera(): WorldCamera {
  const { width, height } = canvasContainerSize();
  const aspect = width / height;

  const mainCamera = makePerspectiveCamera({
    fov: FOV,
    aspect,
    near: NEAR_CLIPPING_PLANE,
    far: FAR_CLIPPING_PLANE,
    position: zoomedPositionFor(aspect),
  });

  return makeWorldObject(mainCamera!.threeObject, {
    setAspect(newAspect: number) {
      mainCamera!.threeObject.position.copy(zoomedPositionFor(newAspect));
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

function zoomedPositionFor(aspect: number): THREE.Vector3 {
  return new THREE.Vector3(0, 0, aspect > 1 ? WIDE_ZOOM : NARROW_ZOOM);
}
