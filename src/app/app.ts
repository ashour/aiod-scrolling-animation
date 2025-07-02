import assets from "@/config/assets";
import engineOptions from "@/config/engine";
import engine from "@/engine";
import gsap from "gsap";
import { directionalLight } from "./directional-light";
import { mainCamera } from "./main-camera";
import { mainScene } from "./main-scene";
import { phone } from "./phone";

export async function app(canvas: HTMLCanvasElement) {
  await engine.init(canvas, assets, engineOptions);

  const aMainScene = mainScene();
  engine.setMainScene(aMainScene);

  const aMainCamera = mainCamera();
  aMainScene.add(aMainCamera);
  engine.setMainCamera(aMainCamera);

  aMainScene.add(directionalLight());

  aMainScene.add(phone());

  engine.run();

  var section0 = document.querySelector("#section-0");
  gsap.from(section0, { xPercent: -100, duration: 0.5, ease: "power1.out" });
}
