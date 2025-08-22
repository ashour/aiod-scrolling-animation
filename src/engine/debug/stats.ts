import Stats from "three/examples/jsm/libs/stats.module";

export function makeStats(container: HTMLElement) {
  const stats = new Stats();

  return {
    setActive(active: boolean) {
      if (active) {
        container.appendChild(stats.dom);
      } else if (container.contains(stats.dom)) {
        container.removeChild(stats.dom);
      }
    },

    update() {
      stats.update();
    },
  };
}
