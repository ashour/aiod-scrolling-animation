import * as THREE from "three";

export function makeAxesWidget(length: number = 2): WorldObject {
  const axesHelper = new THREE.AxesHelper(length);

  return {
    threeObject: axesHelper,
    dispose() {
      axesHelper.dispose();
    },
  };
}
