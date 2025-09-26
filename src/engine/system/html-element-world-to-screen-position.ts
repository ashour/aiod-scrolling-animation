import * as THREE from "three";
import { browserWindow } from "./browser-window";

export function htmlElementWorldToScreenPosition(
  elementSize: THREE.Vector2,
  worldPosition: THREE.Vector3,
  camera: THREE.Camera,
): THREE.Vector2 {
  const halfWindowWidth = browserWindow.width / 2;
  const halfWindowHeight = browserWindow.height / 2;

  const halfLabelWidth = elementSize.x / 2;
  const halfLabelHeight = elementSize.y / 2;

  const elementScreenPos = worldPosition.clone().project(camera);

  const elementScreenPosX = elementScreenPos.x * halfWindowWidth + halfWindowWidth;
  const elementScreenPosY = -elementScreenPos.y * halfWindowHeight + halfWindowHeight;

  return new THREE.Vector2(elementScreenPosX - halfLabelWidth, elementScreenPosY - halfLabelHeight);
}
