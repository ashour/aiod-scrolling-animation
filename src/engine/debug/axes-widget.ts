import * as THREE from "three";

export function axesWidget(length: number = 2): WorldObject {
  const axesHelper = new THREE.AxesHelper(length);

  return {
    threeObject: axesHelper,
    dispose() {
      axesHelper.dispose();
    },
  };
}
