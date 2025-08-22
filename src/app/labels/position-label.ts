import { htmlElementWorldToScreenPosition } from "@/engine/system/html-element-world-to-screen-position";
import * as THREE from "three";
import { labelWorldPositionFor } from "./label-world-position";

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
