import * as THREE from "three";

const cubeTextureLoader = new THREE.CubeTextureLoader();

export function loadCubeTexture(name: string, asset: CubeTextureAssetData): Promise<Resource> {
  return new Promise<Resource>((resolve, reject) => {
    cubeTextureLoader.load(
      asset.paths,
      (texture) => {
        if (asset.colorSpace == "SRGB") {
          texture.colorSpace = THREE.SRGBColorSpace;
        }
        resolve({ name, object: texture });
      },
      undefined,
      (err) => reject(err),
    );
  });
}
