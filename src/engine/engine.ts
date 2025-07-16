import GUI from "lil-gui";
import * as THREE from "three";
import stats from "./debug/stats";
import loader from "./loaders/loader";
import renderer from "./rendering/renderer";
import { browserWindow } from "./system/browser_window";
import time from "./system/time";

const DEBUG_URL_HASH = "#debug";
const DEFAULT_MAX_PIXEL_RATIO = 2;

let _gui: GUI;
let _mainScene: WorldScene | null = null;
let _mainCamera: WorldCamera | null = null;
let _stats: ReturnType<typeof stats>;
let _renderer: ReturnType<typeof renderer>;
let _resources: { [key: string]: Resource } = {};
let _onEarlyUpdateListeners: Array<(deltaTime: number) => void> = [];
let _onLateUpdateListeners: Array<(deltaTime: number) => void> = [];

export default {
  time,
  browserWindow,

  async init(canvas: HTMLCanvasElement, assets: AssetConfig, options: EngineOptions) {
    _renderer = renderer(canvas, options);
    _renderer.setSize(browserWindow.width, browserWindow.height);

    const maxPixelRatio = options.maxPixelRatio ?? DEFAULT_MAX_PIXEL_RATIO;
    _renderer.setPixelRatio(Math.min(browserWindow.devicePixelRatio, maxPixelRatio));

    this.onWindowResize((width: number, height: number) => {
      _renderer.setSize(width, height);
      _renderer.setPixelRatio(Math.min(browserWindow.devicePixelRatio, maxPixelRatio));

      if (_mainCamera) {
        _mainCamera.setAspect(width / height);
      }
    });

    const loadedAssets = await loader.load(assets);
    for (const loadedAsset of loadedAssets) {
      _resources[loadedAsset.name] = loadedAsset;
    }

    this.gui.show(browserWindow.urlHash === DEBUG_URL_HASH);
    this.stats.setActive(browserWindow.urlHash === DEBUG_URL_HASH);
    browserWindow.onHashChange((hash) => {
      this.gui.show(hash === DEBUG_URL_HASH);
      this.stats.setActive(hash === DEBUG_URL_HASH);
    });

    return this;
  },

  get gui() {
    if (!_gui) {
      _gui = new GUI();
    }
    return _gui;
  },

  get stats() {
    if (!_stats) {
      _stats = stats(browserWindow.statsContainer);
    }
    return _stats;
  },

  onWindowResize(callback: OnWindowResizeListener) {
    browserWindow.onResize(callback);
  },

  resource<T>(name: string): T {
    const resource = _resources[name];
    if (resource === undefined) {
      throw new Error(`Could not retrieve resource (${name}).`);
    }
    return resource.object as T;
  },

  clearResources() {
    Object.values(_resources).forEach((resource: { object: { dispose?: () => void } }) => {
      if (typeof resource.object.dispose === "function") {
        resource.object.dispose();
      }
    });
    _resources = {};
  },

  render(scene: WorldScene, camera: WorldCamera) {
    // todo refactor to _renderer.render(scene, camera);
    _renderer.threeRenderer.render(scene.threeObject, camera.threeObject as THREE.Camera);
  },

  clearRendererState() {
    _renderer.clearState();
  },

  run() {
    const self = this;
    (function tick() {
      time.update();

      for (const listener of _onEarlyUpdateListeners) {
        listener(time.deltaTime);
      }

      if (_mainScene && _mainScene.update) {
        _mainScene.update(time.deltaTime);
      }

      for (const listener of _onLateUpdateListeners) {
        listener(time.deltaTime);
      }

      if (_mainScene && _mainCamera) {
        self.render(_mainScene, _mainCamera);
      } else {
        _renderer.threeRenderer.clear();
      }

      self.stats?.update();

      browserWindow.requestAnimationFrame(tick);
    })();
  },

  onEarlyUpdate(callback: (deltaTime: number) => void) {
    _onEarlyUpdateListeners.push(callback);
  },

  onLateUpdate(callback: (deltaTime: number) => void) {
    _onLateUpdateListeners.push(callback);
  },

  setMainScene(scene: WorldScene | null) {
    if (_mainScene) {
      _mainScene.dispose();
    }
    _mainScene = scene;
  },

  setMainCamera(camera: WorldCamera | null) {
    if (_mainCamera) {
      _mainCamera.dispose();
    }
    _mainCamera = camera;
  },
};
