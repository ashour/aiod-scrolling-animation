export function assetWithPathFromBase(asset: Readonly<AssetData>): AssetData {
  const result = { ...asset };
  if (asset.paths) {
    result.paths = asset.paths?.map(assetPathFromBase);
  } else {
    result.path = assetPathFromBase(asset.path);
  }
  return result;
}

function assetPathFromBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return base + cleanPath;
}
