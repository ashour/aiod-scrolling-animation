import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const rgbeLoader = new RGBELoader();

export function loadRGBE(name: string, asset: HDRAssetData): Promise<Resource> {
  return new Promise<Resource>((resolve, reject) => {
    rgbeLoader.load(
      asset.path,
      (hdr) => resolve({ name, object: hdr }),
      undefined,
      (err: unknown) => reject(err),
    );
  });
}
