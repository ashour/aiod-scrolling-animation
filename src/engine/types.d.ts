type RendererOptions = {
  antialias?: boolean;
  alpha?: boolean;
  toneMapping?: import("three").ToneMapping;
  toneMappingExposure?: number;
  enableShadows?: boolean;
  shadowMapType?: import("three").ShadowMapType;
  clearColor?: import("three").ColorRepresentation;
};

type EngineOptions = RendererOptions & { maxPixelRatio?: number };

type AssetDataBase = {
  type: "texture" | "cubeTexture" | "gltf";
};

type TexutureAssetColorSpace = "noColorSpace" | "SRGB";
type TextureAssetWrap = "clamp" | "repeat";

type TextureAssetData = AssetDataBase & {
  type: "texture";
  path: string;
  paths?: never;
  colorSpace?: TexutureAssetColorSpace;
  repeat?: [number, number];
  wrap?: [TextureAssetWrap, TextureAssetWrap];
};

type CubeTextureAssetData = AssetDataBase & {
  type: "cubeTexture";
  path?: never;
  paths: string[];
  colorSpace?: TexutureAssetColorSpace;
};

type GLTFAssetData = AssetDataBase & {
  type: "gltf";
  path: string;
  paths?: never;
};

type AssetData = CubeTextureAssetData | GLTFAssetData | TextureAssetData;

type AssetConfig = Record<string, AssetData>;

type Resource = {
  name: string;
  object: object;
};

type Vec3 = [number, number, number];

type OnWindowResizeListener = (width: number, height: number) => void;

type WorldObject = {
  threeObject: import("three").Object3D;
  update?(deltaTime: number): void;
  dispose(): void;
};

type WorldScene = WorldObject & {
  threeScene: import("three").Scene;
  add(object: WorldObject): void;
};

type WorldCamera = WorldObject & {
  setAspect(newAspect: number): void;
};
