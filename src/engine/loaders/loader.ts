import { assetWithPathFromBase } from "./asset-paths";
import { loadCubeTexture } from "./cube-texture-loader";
import { loadGLTF } from "./gltf-loader";
import { loadRGBE } from "./rgbe-loader";
import { loadTexture } from "./texture-loader";

export default {
  load(assets: AssetConfig): Promise<Resource[]> {
    return Promise.all(
      Object.entries(assets).map(([name, assetData]) => {
        const assetDataWithPathFromBase = assetWithPathFromBase(assetData);

        switch (assetDataWithPathFromBase.type) {
          case "cubeTexture":
            return loadCubeTexture(name, assetDataWithPathFromBase);
          case "gltf":
            return loadGLTF(name, assetDataWithPathFromBase);
          case "hdr":
            return loadRGBE(name, assetDataWithPathFromBase);
          case "texture":
            return loadTexture(name, assetDataWithPathFromBase);
          default:
            const unknownAsset = assetDataWithPathFromBase as { type: string };
            return Promise.reject(
              new Error(
                `Unsupported asset type \"${unknownAsset.type}\" assigned to asset (${name})`,
              ),
            );
        }
      }),
    );
  },
};
