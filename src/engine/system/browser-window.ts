const nativeWindow = window;

const size = {
  width: nativeWindow.innerWidth,
  height: nativeWindow.innerHeight,
};

const onWindowResizeListeners: Array<OnWindowResizeListener> = [];

nativeWindow.addEventListener("resize", () => {
  size.width = nativeWindow.innerWidth;
  size.height = nativeWindow.innerHeight;

  for (const listener of onWindowResizeListeners) {
    listener(size.width, size.height);
  }
});

const onHashChangeListeners: Array<(hash: string) => void> = [];

nativeWindow.addEventListener("hashchange", () => {
  for (const listener of onHashChangeListeners) {
    listener(nativeWindow.location.hash);
  }
});

export const browserWindow = {
  get width() {
    return size.width;
  },
  get height() {
    return size.height;
  },

  statsContainer: document.body,
  requestAnimationFrame: nativeWindow.requestAnimationFrame.bind(nativeWindow),

  get devicePixelRatio() {
    return nativeWindow.devicePixelRatio;
  },

  get urlHash() {
    return nativeWindow.location.hash;
  },

  onResize(callback: OnWindowResizeListener) {
    onWindowResizeListeners.push(callback);
  },

  onHashChange(callback: (hash: string) => void) {
    onHashChangeListeners.push(callback);
  },
};
