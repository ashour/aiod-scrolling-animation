import engine from "@/engine";
import { makeMainCamera } from "./main-camera";

const canvasContainer = document.querySelector(".webgl-container")! as HTMLElement;

let lastWidth = -1;
let lastHeight = -1;

export function resizeCanvas(mainCamera: ReturnType<typeof makeMainCamera>) {
  const width = Math.round(canvasContainer.offsetWidth);
  const height = Math.round(canvasContainer.offsetHeight);

  if (width !== lastWidth || height !== lastHeight) {
    engine.renderer.setSize(width, height, false);
    if (mainCamera) {
      mainCamera.setAspect(width / height);
    }

    lastWidth = width;
    lastHeight = height;
  }
}
