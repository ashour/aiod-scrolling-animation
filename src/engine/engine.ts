import GUI from "lil-gui";
import { makeStats } from "./debug/stats";
import loader from "./loaders/loader";
import makeRenderer from "./rendering/renderer";
import { browserWindow } from "./system/browser-window";
import time from "./system/time";

const DEBUG_URL_HASH = "#debug";
const DEFAULT_MAX_PIXEL_RATIO = 2;

let gui: GUI;
let mainScene: WorldScene | null = null;
let mainCamera: WorldCamera | null = null;
let stats: ReturnType<typeof makeStats>;
let renderer: ReturnType<typeof makeRenderer>;
let resources: { [key: string]: Resource } = {};
let onEarlyUpdateListeners: Array<(deltaTime: number) => void> = [];
let onLateUpdateListeners: Array<(deltaTime: number) => void> = [];

export default {
  time,
  browserWindow,

  async init(canvas: HTMLCanvasElement, assets: AssetConfig, options: EngineOptions) {
    renderer = makeRenderer(canvas, options);
    renderer.setSize(browserWindow.width, browserWindow.height);

    const maxPixelRatio = options.maxPixelRatio ?? DEFAULT_MAX_PIXEL_RATIO;
    renderer.setPixelRatio(Math.min(browserWindow.devicePixelRatio, maxPixelRatio));

    this.onWindowResize((width: number, height: number) => {
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(browserWindow.devicePixelRatio, maxPixelRatio));

      if (mainCamera) {
        mainCamera.setAspect(width / height);
      }
    });

    const loadedAssets = await loader.load(assets);
    for (const loadedAsset of loadedAssets) {
      resources[loadedAsset.name] = loadedAsset;
    }

    this.gui.show(browserWindow.urlHash === DEBUG_URL_HASH);
    this.stats.setActive(browserWindow.urlHash === DEBUG_URL_HASH);
    browserWindow.onHashChange((hash) => {
      this.gui.show(hash === DEBUG_URL_HASH);
      this.stats.setActive(hash === DEBUG_URL_HASH);
    });

    return this;
  },

  get renderer() {
    return renderer;
  },

  get gui() {
    if (!gui) {
      gui = new GUI();
    }
    return gui;
  },

  get stats() {
    if (!stats) {
      stats = makeStats(browserWindow.statsContainer);
    }
    return stats;
  },

  onWindowResize(callback: OnWindowResizeListener) {
    browserWindow.onResize(callback);
  },

  resource<T>(name: string): T {
    const resource = resources[name];
    if (resource === undefined) {
      throw new Error(`Could not retrieve resource (${name}).`);
    }
    return resource.object as T;
  },

  clearResources() {
    Object.values(resources).forEach((resource: { object: { dispose?: () => void } }) => {
      if (typeof resource.object.dispose === "function") {
        resource.object.dispose();
      }
    });
    resources = {};
  },

  render(scene: WorldScene, camera: WorldCamera) {
    renderer.render(scene, camera);
  },

  clearRendererState() {
    renderer.clearState();
  },

  run() {
    const self = this;
    (function tick() {
      time.update();

      for (const listener of onEarlyUpdateListeners) {
        listener(time.deltaTime);
      }

      if (mainScene && mainScene.update) {
        mainScene.update(time.deltaTime);
      }

      for (const listener of onLateUpdateListeners) {
        listener(time.deltaTime);
      }

      if (mainScene && mainCamera) {
        self.render(mainScene, mainCamera);
      } else {
        renderer.threeRenderer.clear();
      }

      self.stats?.update();

      browserWindow.requestAnimationFrame(tick);
    })();
  },

  onEarlyUpdate(callback: (deltaTime: number) => void) {
    onEarlyUpdateListeners.push(callback);
  },

  onLateUpdate(callback: (deltaTime: number) => void) {
    onLateUpdateListeners.push(callback);
  },

  setMainScene(scene: WorldScene | null) {
    if (mainScene) {
      mainScene.dispose();
    }
    mainScene = scene;
  },

  setMainCamera(camera: WorldCamera | null) {
    if (mainCamera) {
      mainCamera.dispose();
    }
    mainCamera = camera;
  },
};
