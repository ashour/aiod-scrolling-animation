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

type WorldObjectOptions<T = {}> = {
  update?: (deltaTime: number) => void;
  gui?(gui: import("lil-gui").GUI): import("lil-gui").GUI;
  dispose?: () => void;
} & T;

type WorldObject<T = {}> = {
  threeObject: import("three").Object3D;
  update?(deltaTime: number): void;
  dispose(): void;
} & T;

type WorldScene<T = {}> = WorldObject<T> & {
  threeScene: import("three").Scene;
  add(object: WorldObject<T>): void;
};

type WorldCamera = WorldObject<{}> & {
  setAspect(newAspect: number): void;
  gui?(gui: import("lil-gui").GUI): import("lil-gui").GUI;
};

declare module "*.vert?raw" {
  const content: string;
  export default content;
}

declare module "*.frag?raw" {
  const content: string;
  export default content;
}

declare module "*.glsl?raw" {
  const content: string;
  export default content;
}
