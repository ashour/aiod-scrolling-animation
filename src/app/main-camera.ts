import { perspectiveCamera } from "@/engine/rendering/camera";
import { browserWindow } from "@/engine/system/browser_window";
import worldObject from "@/engine/world/worldObject";

export function mainCamera(): WorldCamera {
  const mainCamera = perspectiveCamera({
    fov: 35,
    aspect: browserWindow.width / browserWindow.height,
    near: 0.1,
    far: 100,
    position: [0, 0, 70],
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
      return folder;
    },
    dispose() {},
  });
}
