import assets from "@/config/assets";
import engineOptions from "@/config/engine";
import engine from "@/engine";
import "@/styles/styles";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resizeCanvas } from "./canvas-size";
import { makeAmbientLight } from "./lights/ambient-light";
import { makeDirectionalLight } from "./lights/directional-light";
import { makeMainCamera } from "./main-camera";
import { makeMainScene } from "./main-scene";
import { makePhone } from "./phone/phone";
import { makeSectionAnimations } from "./scrolling-animations/section-animations";

gsap.registerPlugin(ScrollTrigger);

export async function app(canvas: HTMLCanvasElement) {
  await engine.init(canvas, assets, engineOptions);

  const mainScene = makeMainScene();
  engine.setMainScene(mainScene);

  const mainCamera = makeMainCamera();
  mainScene.add(mainCamera);
  engine.setMainCamera(mainCamera);

  engine.onEarlyUpdate(() => resizeCanvas(mainCamera));

  mainScene.add(makeAmbientLight());
  mainScene.add(makeDirectionalLight());

  const phone = makePhone();
  mainScene.add(phone);

  // Render once so that phone has position to establish
  // positiong for animations.
  engine.render(mainScene, mainCamera);

  makeSectionAnimations(phone, mainCamera);

  engine.run();
  phone.startFloating();
}
