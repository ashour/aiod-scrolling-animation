import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let _controls: OrbitControls | null;

type OrbitControlsOptions = {
  enableDamping?: boolean;
};

const defaultOptions: OrbitControlsOptions = {
  enableDamping: true,
};

export default {
  init(camera: WorldCamera, canvas: HTMLCanvasElement, options: OrbitControlsOptions = {}) {
    const opt = {
      ...defaultOptions,
      ...options,
    } as Required<OrbitControlsOptions>;

    _controls = new OrbitControls(camera.threeObject as THREE.Camera, canvas);
    _controls.enableDamping = opt.enableDamping;
  },

  update() {
    _controls?.update();
  },

  dispose() {
    _controls?.dispose();
    _controls = null;
  },
};
