import loadCubeTexture from "./cube_texture_loader";
import loadGLTF from "./gltf_loader";
import { loadRGBE } from "./rgbe-loader";
import loadTexture from "./texture_loader";

export default {
  load(assets: AssetConfig): Promise<Resource[]> {
    return Promise.all(
      Object.entries(assets).map(([name, asset]) => {
        switch (asset.type) {
          case "cubeTexture":
            return loadCubeTexture(name, asset);
          case "gltf":
            return loadGLTF(name, asset);
          case "hdr":
            return loadRGBE(name, asset);
          case "texture":
            return loadTexture(name, asset);
          default:
            const unknownAsset = asset as { type: string };
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
