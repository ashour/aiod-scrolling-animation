import assets from "@/config/assets";
import engineOptions from "@/config/engine";
import engine from "@/engine";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { makeAmbientLight } from "./ambient-light";
import { makeDirectionalLight } from "./directional-light";
import { makeMainCamera } from "./main-camera";
import { makeMainScene } from "./main-scene";
import { makePhone } from "./phone/phone";
import { positionLabel } from "./position-label";

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

  const label_1_0 = document.getElementById("label-1-0")!;
  const positionLabel_1_0 = () => {
    positionLabel({
      label: label_1_0,
      cssProperties: ["--label0-translateX", "--label0-translateY"],
      worldPosition: new THREE.Vector3(-7.877, -4.702, 1.957),
      camera: mainCamera.threeObject as THREE.Camera,
    });
  };
  positionLabel_1_0();
  engine.onWindowResize(positionLabel_1_0);

  let section1Timeline = gsap.timeline({
    scrollTrigger: {
      id: "section-1",
      trigger: "#section-1",
      start: "+=200 99%",
      end: "top 20%",
      scrub: 0.13,
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
    .to("#section-0-header", { y: "100vh", duration: 2, ease: "power1.out" })
    .addLabel("phone")
    .to(section1PhoneAnimationProgress, {
      value: 1,
      duration: 6,
      ease: "none",
      onUpdate: () => {
        phone.setAnimationTime(0, section1PhoneAnimationProgress.value);
      },
    })
    .addLabel("labels")
    .to(label_1_0, { "--label0-scale": 1, duration: 2, ease: "power1.out" })
    .addLabel("nextHeaderUp")
    .to("#section-1-header", { y: 0, duration: 2, ease: "power1.out" }, "<");

  let section2Timeline = gsap.timeline({
    scrollTrigger: {
      id: "section-2",
      trigger: "#section-2",
      start: "+=200 80%",
      end: "top 20%",
      scrub: 0.13,
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
    .to("#section-1-header", { y: "100vh", duration: 2, ease: "power1.out" })
    .addLabel("phone")
    .to(section2PhoneAnimationProgress, {
      value: 1,
      duration: 6,
      ease: "none",
      onUpdate: () => {
        phone.setAnimationTime(1, section2PhoneAnimationProgress.value);
      },
    })
    .addLabel("section2HeaderIn")
    .to("#section-2-header", { y: 0, duration: 2, ease: "power1.out" });
}
