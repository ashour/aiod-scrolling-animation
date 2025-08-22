import * as THREE from "three";

const defaultOptions: RendererOptions = {
  antialias: false,
  toneMapping: THREE.NoToneMapping,
  toneMappingExposure: 1,
  enableShadows: false,
  shadowMapType: THREE.PCFShadowMap,
};

export default function makeRenderer(canvas: HTMLCanvasElement, options: RendererOptions) {
  const opt = { ...defaultOptions, ...options } as Required<RendererOptions>;

  const threeRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: opt.alpha,
    antialias: opt.antialias,
  });

  threeRenderer.toneMapping = opt.toneMapping;
  threeRenderer.toneMappingExposure = opt.toneMappingExposure;
  threeRenderer.shadowMap.enabled = opt.enableShadows;
  threeRenderer.shadowMap.type = opt.shadowMapType;

  if (opt.clearColor) {
    threeRenderer.setClearColor(opt.clearColor);
  }

  return {
    threeRenderer,

    render(scene: WorldScene, camera: WorldCamera) {
      threeRenderer.render(scene.threeObject, camera.threeObject as THREE.Camera);
    },

    clearState() {
      threeRenderer.renderLists.dispose();
      threeRenderer.info.reset();
    },

    info() {
      const threeInfo = threeRenderer.info;
      return {
        geometries: threeInfo.memory.geometries,
        textures: threeInfo.memory.textures,
        programs: threeInfo.programs?.length,
        calls: threeInfo.render.calls,
        triangles: threeInfo.render.triangles,
      };
    },

    setSize: threeRenderer.setSize.bind(threeRenderer),
    setPixelRatio: threeRenderer.setPixelRatio.bind(threeRenderer),
  };
}
