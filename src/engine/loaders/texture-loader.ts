import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

export function loadTexture(name: string, asset: TextureAssetData): Promise<Resource> {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      asset.path,
      (texture) => {
        if (asset.colorSpace && asset.colorSpace == "SRGB") {
          texture.colorSpace = THREE.SRGBColorSpace;
        }

        if (asset.repeat) {
          texture.repeat.set(...asset.repeat);
        }

        if (asset.wrap) {
          const [wrapS, wrapT] = asset.wrap;
          texture.wrapS = wrapS == "repeat" ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
          texture.wrapT = wrapT == "repeat" ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
        }

        resolve({ name, object: texture });
      },
      undefined,
      (err) => reject(err),
    );
  });
}
