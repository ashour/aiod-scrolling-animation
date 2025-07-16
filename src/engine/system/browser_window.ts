const _nativeWindow = window;

const _size = {
  width: _nativeWindow.innerWidth,
  height: _nativeWindow.innerHeight,
};

const _onWindowResizeListeners: Array<OnWindowResizeListener> = [];

_nativeWindow.addEventListener("resize", () => {
  _size.width = _nativeWindow.innerWidth;
  _size.height = _nativeWindow.innerHeight;

  for (const listener of _onWindowResizeListeners) {
    listener(_size.width, _size.height);
  }
});

const _onHashChangeListeners: Array<(hash: string) => void> = [];

_nativeWindow.addEventListener("hashchange", () => {
  for (const listener of _onHashChangeListeners) {
    listener(_nativeWindow.location.hash);
  }
});

export const browserWindow = {
  width: _size.width,
  height: _size.height,

  statsContainer: document.body,
  requestAnimationFrame: _nativeWindow.requestAnimationFrame.bind(_nativeWindow),

  get devicePixelRatio() {
    return _nativeWindow.devicePixelRatio;
  },

  get urlHash() {
    return _nativeWindow.location.hash;
  },

  onResize(callback: OnWindowResizeListener) {
    _onWindowResizeListeners.push(callback);
  },

  onHashChange(callback: (hash: string) => void) {
    _onHashChangeListeners.push(callback);
  },
};
