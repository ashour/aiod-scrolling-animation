import { LARGE_SCREEN_BREAKPOINT_PX, MEDIUM_SCREEN_BREAKPOINT_PX } from "@/config/app";
import { browserWindow } from "@/engine/system/browser-window";
import { htmlElementWorldToScreenPosition } from "@/engine/system/html-element-world-to-screen-position";
import * as THREE from "three";

export function makeLabelPositionerFor(label: HTMLElement, camera: WorldCamera): () => void {
  return () => {
    positionLabel({
      label,
      worldPosition: labelWorldPositionFor(label),
      camera: camera.threeObject as THREE.Camera,
    });
  };
}

function positionLabel({
  label,
  worldPosition,
  camera,
}: {
  label: HTMLElement;
  worldPosition: THREE.Vector3;
  camera: THREE.Camera;
}): void {
  const labelScreenPosition = htmlElementWorldToScreenPosition(
    new THREE.Vector2(label.offsetWidth, label.offsetHeight),
    worldPosition,
    camera,
  );

  label.style.top = `${labelScreenPosition.y}px`;
  label.style.left = `${labelScreenPosition.x}px`;
}

function labelWorldPositionFor(label: HTMLElement): THREE.Vector3 {
  let worldPositionText: string;
  if (browserWindow.mediaQueryMatches(`(min-width: ${LARGE_SCREEN_BREAKPOINT_PX}px)`)) {
    worldPositionText =
      label.getAttribute("data-world-position-lg") || label.getAttribute("data-world-position")!;
  } else if (browserWindow.mediaQueryMatches(`(min-width: ${MEDIUM_SCREEN_BREAKPOINT_PX}px)`)) {
    worldPositionText =
      label.getAttribute("data-world-position-md") || label.getAttribute("data-world-position")!;
  } else {
    worldPositionText = label.getAttribute("data-world-position")!;
  }
  const worldPositionNumberArray = worldPositionText.split(",").map((str) => parseFloat(str));
  return new THREE.Vector3(...worldPositionNumberArray);
}
