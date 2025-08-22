import * as THREE from "three";

export function labelWorldPositionFor(label: HTMLElement): THREE.Vector3 {
  const worldPositionText = label.getAttribute("data-world-position")!;
  const worldPositionNumberArray = worldPositionText.split(",").map((str) => parseFloat(str));
  return new THREE.Vector3(...worldPositionNumberArray);
}
