import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let controls: OrbitControls | null;

type OrbitControlsOptions = {
  enableDamping?: boolean;
};

const defaultOptions: OrbitControlsOptions = {
  enableDamping: true,
};

export function makeOrbitControls(
  camera: WorldCamera,
  canvas: HTMLCanvasElement,
  options: OrbitControlsOptions = {},
) {
  const opt = {
    ...defaultOptions,
    ...options,
  } as Required<OrbitControlsOptions>;

  if (!controls) {
    controls = new OrbitControls(camera.threeObject as THREE.Camera, canvas);
  }
  controls.enableDamping = opt.enableDamping;

  return {
    update() {
      controls?.update();
    },

    dispose() {
      controls?.dispose();
      controls = null;
    },
  };
}
