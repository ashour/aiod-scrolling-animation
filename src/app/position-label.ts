import { htmlElementWorldToScreenPosition } from "@/engine/system/html-element-world-to-screen-position";
import * as THREE from "three";

type PositionLabelParams = {
  label: HTMLElement;
  cssProperties: [string, string];
  worldPosition: THREE.Vector3;
  camera: THREE.Camera;
};

export function positionLabel({
  label,
  cssProperties,
  worldPosition,
  camera,
}: PositionLabelParams): void {
  const labelScreenPosition = htmlElementWorldToScreenPosition(
    new THREE.Vector2(label.offsetWidth, label.offsetHeight),
    worldPosition,
    camera,
  );

  label.style.setProperty(cssProperties[0], `${labelScreenPosition.x}px`);
  label.style.setProperty(cssProperties[1], `${labelScreenPosition.y}px`);
}
