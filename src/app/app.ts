import assets from "@/config/assets";
import engineOptions from "@/config/engine";
import engine from "@/engine";
import { axesWidget } from "@/engine/debug/axes-widget";
import { browserWindow } from "@/engine/system/browser_window";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { directionalLight } from "./directional-light";
import { mainCamera } from "./main-camera";
import { mainScene } from "./main-scene";
import { phone } from "./phone";

gsap.registerPlugin(ScrollTrigger);

export async function app(canvas: HTMLCanvasElement) {
  await engine.init(canvas, assets, engineOptions);

  const aMainScene = mainScene();
  engine.setMainScene(aMainScene);

  const aMainCamera = mainCamera();
  aMainScene.add(aMainCamera);
  engine.setMainCamera(aMainCamera);

  aMainScene.add(axesWidget(8));

  aMainScene.add(directionalLight());

  const woPhone = phone();
  aMainScene.add(woPhone);

  engine.run();

  let phoneWorldPos = new THREE.Vector3();
  const testLabel = document.getElementById("test")!;
  const piece1 = woPhone.threeObject.getObjectByName("Piece1")!;
  const piece2 = woPhone.threeObject.getObjectByName("Piece2")!;
  let piece1WorldPos = new THREE.Vector3();
  let piece2WorldPos = new THREE.Vector3();
  const label0 = document.getElementById("label-1-0")!;
  const label1 = document.getElementById("label-1-1")!;
  engine.onLateUpdate((_deltaTime) => {
    woPhone.threeObject.getWorldPosition(phoneWorldPos);
    phoneWorldPos.project(aMainCamera.threeObject as THREE.Camera);

    const halfWindowWidth = browserWindow.width / 2;
    const halfWindowHeight = browserWindow.height / 2;

    const phoneScreenPosX = phoneWorldPos.x * halfWindowWidth + halfWindowWidth;
    const phoneScreenPosY = -phoneWorldPos.y * halfWindowHeight + halfWindowHeight + window.scrollY;

    const halfTestLabelWidth = testLabel.offsetWidth / 2;

    testLabel.style.translate = `${phoneScreenPosX - halfTestLabelWidth}px ${phoneScreenPosY - 190}px`;

    const halfLabel0Width = label0.offsetWidth / 2;
    piece1.getWorldPosition(piece1WorldPos);
    piece1WorldPos.project(aMainCamera.threeObject as THREE.Camera);
    const piece1ScreenPosX = piece1WorldPos.x * halfWindowWidth + halfWindowWidth;
    const piece1ScreenPosY =
      -piece1WorldPos.y * halfWindowHeight + halfWindowHeight + window.scrollY;
    label0.style.translate = `${piece1ScreenPosX - halfLabel0Width}px ${piece1ScreenPosY + 40}px`;
  });

  const section0 = document.querySelector("#section-0");
  gsap.from(section0, { xPercent: -100, duration: 0.5, ease: "power1.out" });

  const section1BeginPhoneRotation = { x: -3.5, y: 0.4, z: 0.2 };
  const section1EndPhoneRotation = { x: -3.3, y: -0.6, z: -0.1 };
  const section1Text = document.querySelector("#section-1 .section__text");
  let timeline = gsap.timeline({
    scrollTrigger: {
      id: "section-1",
      trigger: section1Text,
      end: "bottom 25%",
      scrub: 1,
      snap: {
        snapTo: 1,
        ease: "power3",
      },
      markers: true,
      onEnter: (_self) => {
        woPhone.updateAnimationInLoop(false);
        woPhone.toggleFloat(false);
      },
      onEnterBack: (_self) => {
        woPhone.updateAnimationInLoop(false);
        woPhone.toggleFloat(false);
      },
      onLeave: (_self) => {
        woPhone.updateAnimationInLoop(false);
        woPhone.toggleFloat(true);
      },
      onLeaveBack: (_self) => {
        woPhone.updateAnimationInLoop(false);
        woPhone.toggleFloat(true);
      },
      onUpdate: (self) => {
        woPhone.setAnimationTime(self.progress);

        // woPhone.threeObject.rotation.set(
        //   gsap.utils.interpolate(
        //     section1BeginPhoneRotation.x,
        //     section1EndPhoneRotation.x,
        //     self.progress,
        //   ),
        //   gsap.utils.interpolate(
        //     section1BeginPhoneRotation.y,
        //     section1EndPhoneRotation.y,
        //     self.progress,
        //   ),
        //   gsap.utils.interpolate(
        //     section1BeginPhoneRotation.z,
        //     section1EndPhoneRotation.z,
        //     self.progress,
        //   ),
        // );
      },
    },
  });
  timeline.from(section1Text, {
    xPercent: -100,
    ease: "power1.out",
  });

  timeline.to(label0, { scale: 1 });

  // const section2EndPhoneRotation = { x: -3.5, y: 0.4, z: 0.2 };
  // const section2Text = document.querySelector("#section-2 .section__text");
  // gsap.from(section2Text, {
  //   scrollTrigger: {
  //     id: "section-2",
  //     trigger: section2Text,
  //     end: "bottom 25%",
  //     scrub: 2,
  //     snap: {
  //       snapTo: 1,
  //       ease: "power3",
  //     },
  //     markers: true,
  //     onEnter: (_self) => {
  //       woPhone.toggleFloat(false);
  //     },
  //     onEnterBack: (_self) => {
  //       woPhone.toggleFloat(false);
  //     },
  //     onLeave: (_self) => {
  //       woPhone.toggleFloat(true);
  //     },
  //     onLeaveBack: (_self) => {
  //       woPhone.toggleFloat(true);
  //     },
  //     onUpdate: (self) => {
  //       woPhone.threeObject.rotation.set(
  //         gsap.utils.interpolate(
  //           section1EndPhoneRotation.x,
  //           section2EndPhoneRotation.x,
  //           self.progress,
  //         ),
  //         gsap.utils.interpolate(
  //           section1EndPhoneRotation.y,
  //           section2EndPhoneRotation.y,
  //           self.progress,
  //         ),
  //         gsap.utils.interpolate(
  //           section1EndPhoneRotation.z,
  //           section2EndPhoneRotation.z,
  //           self.progress,
  //         ),
  //       );
  //     },
  //   },
  //   xPercent: -100,
  //   ease: "power1.out",
  // });
}
