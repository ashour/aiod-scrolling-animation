import * as THREE from "three";

const engineOptions: EngineOptions = {
  antialias: true,
  alpha: true,
  toneMapping: THREE.CineonToneMapping,
  toneMappingExposure: 1.75,
  enableShadows: false,
  maxPixelRatio: 2,
};
export default engineOptions;
