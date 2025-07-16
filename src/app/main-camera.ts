import { perspectiveCamera } from "@/engine/rendering/camera";
import { browserWindow } from "@/engine/system/browser_window";

export function mainCamera(): WorldCamera {
  const mainCamera = perspectiveCamera({
    fov: 35,
    aspect: browserWindow.width / browserWindow.height,
    near: 0.1,
    far: 100,
    position: [0, 0, 64],
  });

  return {
    threeObject: mainCamera!.threeObject,
    setAspect(newAspect: number) {
      mainCamera!.setAspect(newAspect);
    },
    dispose() {},
  };
}
