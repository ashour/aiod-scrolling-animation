import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const gltfLoader = new GLTFLoader();

export function loadGLTF(name: string, asset: GLTFAssetData): Promise<Resource> {
  return new Promise<Resource>((resolve, reject) => {
    (gltfLoader.load(asset.path, (gltf) => resolve({ name, object: gltf })),
      undefined,
      (err: unknown) => reject(err));
  });
}
