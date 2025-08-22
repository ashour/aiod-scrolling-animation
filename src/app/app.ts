import assets from "@/config/assets";
import engineOptions from "@/config/engine";
import engine from "@/engine";
import { browserWindow } from "@/engine/system/browser_window";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { makeAmbientLight } from "./ambient-light";
import { makeDirectionalLight } from "./directional-light";
import { makeMainCamera } from "./main-camera";
import { makeMainScene } from "./main-scene";
import { makePhone } from "./phone/phone";

gsap.registerPlugin(ScrollTrigger);

export async function app(canvas: HTMLCanvasElement) {
  await engine.init(canvas, assets, engineOptions);

  const mainScene = makeMainScene();
  engine.setMainScene(mainScene);

  const mainCamera = makeMainCamera();
  mainScene.add(mainCamera);
  engine.setMainCamera(mainCamera);

  mainScene.add(makeAmbientLight());
  mainScene.add(makeDirectionalLight());

  const phone = makePhone();
  mainScene.add(phone);

  engine.run();

  phone.startFloating();

  let piece1AnimatingAverageWorldPos = new THREE.Vector3(-7.877, -10.702, 1.957);
  const label0 = document.getElementById("label-1-0")!;
  function positionLabel0() {
    const halfWindowWidth = browserWindow.width / 2;
    const halfWindowHeight = browserWindow.height / 2;

    const halfLabel0Width = label0.offsetWidth / 2;

    let piece1AverageWorldPos = piece1AnimatingAverageWorldPos.clone();
    piece1AverageWorldPos.project(mainCamera.threeObject as THREE.Camera);

    const piece1ScreenPosX = piece1AverageWorldPos.x * halfWindowWidth + halfWindowWidth;
    const piece1ScreenPosY = -piece1AverageWorldPos.y * halfWindowHeight + halfWindowHeight;
    label0.style.setProperty("--label0-translateX", `${piece1ScreenPosX - halfLabel0Width}px`);
    label0.style.setProperty("--label0-translateY", `${piece1ScreenPosY - 200}px`);
  }
  positionLabel0();
  engine.onWindowResize(positionLabel0);

  let section1Timeline = gsap.timeline({
    scrollTrigger: {
      id: "section-1",
      trigger: "#section-1",
      start: "+=200 99%",
      end: "top 1%",
      scrub: 1,
      snap: {
        snapTo: 1,
        ease: "none",
      },
      markers: true,
      onEnter: (_self) => {
        phone.stopFloating();
      },
      onEnterBack: (_self) => {
        phone.stopFloating();
      },
      onLeave: (_self) => {
        phone.startFloating();
      },
      onLeaveBack: (_self) => {
        phone.startFloating();
      },
    },
  });

  const section1PhoneAnimationProgress = { value: 0 };

  section1Timeline
    .addLabel("currentHeaderDown")
    .to("#section-0-header", { y: "100vh", duration: 0.5, ease: "power1.out" })
    .addLabel("phone")
    .to(section1PhoneAnimationProgress, {
      value: 1,
      duration: 8,
      ease: "none",
      onUpdate: () => {
        phone.setAnimationTime(0, section1PhoneAnimationProgress.value);
      },
    })
    .addLabel("labels")
    .to(label0, { "--label0-scale": 1, duration: 0.5, ease: "power1.out" })
    .addLabel("nextHeaderUp")
    .to("#section-1-header", { y: 0, duration: 0.5, ease: "power1.out" }, "<");

  let section2Timeline = gsap.timeline({
    scrollTrigger: {
      id: "section-2",
      trigger: "#section-2",
      start: "+=200 99%",
      end: "top 1%",
      scrub: 1,
      snap: {
        snapTo: 1,
        ease: "none",
      },
      markers: true,
      onEnter: (_self) => {
        phone.stopFloating();
      },
      onEnterBack: (_self) => {
        phone.stopFloating();
      },
      onLeave: (_self) => {
        phone.startFloating();
      },
      onLeaveBack: (_self) => {
        phone.startFloating();
      },
    },
  });

  const section2PhoneAnimationProgress = { value: 0 };

  section2Timeline
    .addLabel("section1HeaderOut")
    .to("#section-1-header", { y: "100vh", duration: 0.5, ease: "power1.out" })
    .addLabel("phone")
    .to(section2PhoneAnimationProgress, {
      value: 1,
      duration: 8,
      ease: "none",
      onUpdate: () => {
        phone.setAnimationTime(1, section2PhoneAnimationProgress.value);
      },
    })
    .addLabel("section2HeaderIn")
    .to("#section-2-header", { y: 0, duration: 0.5, ease: "power1.out" });
}
