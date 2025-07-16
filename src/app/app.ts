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

  let phonePosition = new THREE.Vector3();
  const testLabel = document.getElementById("test")!;
  engine.onLateUpdate((_deltaTime) => {
    woPhone.threeObject.getWorldPosition(phonePosition);
    phonePosition.project(aMainCamera.threeObject as THREE.Camera);

    const halfWindowWidth = browserWindow.width / 2;
    const halfWindowHeight = browserWindow.height / 2;

    const screenPositionX = phonePosition.x * halfWindowWidth + halfWindowWidth;
    const screenPositionY = -phonePosition.y * halfWindowHeight + halfWindowHeight;

    const halfLabelWidth = testLabel.offsetWidth / 2;

    testLabel.style.left = `${screenPositionX - halfLabelWidth}px`;
    testLabel.style.top = `${screenPositionY - 165}px`;
  });

  const section0 = document.querySelector("#section-0");
  gsap.from(section0, { xPercent: -100, duration: 0.5, ease: "power1.out" });

  const section1BeginPhoneRotation = { x: -3.5, y: 0.4, z: 0.2 };
  const section1EndPhoneRotation = { x: -3.3, y: -0.6, z: -0.1 };
  const section1Text = document.querySelector("#section-1 .section__text");
  gsap.from(section1Text, {
    scrollTrigger: {
      id: "section-1",
      trigger: section1Text,
      end: "bottom 25%",
      scrub: 2,
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
    xPercent: -100,
    ease: "power1.out",
  });

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
