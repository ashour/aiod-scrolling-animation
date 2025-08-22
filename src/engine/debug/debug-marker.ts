import * as THREE from "three";

const SEGMENT_COUNT = 8;
const RENDER_ORDER = 999;
const DEFAULT_SIZE = 0.24;
const DEFAULT_COLOR = 0xff0000;

export function makeDebugMarker(
  position: THREE.Vector3,
  size = DEFAULT_SIZE,
  color: THREE.ColorRepresentation = DEFAULT_COLOR,
): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(size, SEGMENT_COUNT, SEGMENT_COUNT);
  const material = new THREE.MeshBasicMaterial({ color, depthTest: false, depthWrite: false });
  const marker = new THREE.Mesh(geometry, material);
  marker.position.copy(position);
  marker.renderOrder = RENDER_ORDER;
  marker.frustumCulled = false;
  return marker;
}
