import { app } from "@/app/app";

(function main() {
  const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
  app(canvas);
})();
