import assets from "@/config/assets";
import engineOptions from "@/config/engine";
import engine from "@/engine";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

  aMainScene.add(directionalLight());

  const woPhone = phone();
  const originalPhoneRotation = woPhone.threeObject.rotation.clone();
  aMainScene.add(woPhone);

  engine.run();

  const section0 = document.querySelector("#section-0");
  gsap.from(section0, { xPercent: -100, duration: 0.5, ease: "power1.out" });

  const section1Text = document.querySelector("#section-1 .section__text");
  gsap.from(section1Text, {
    scrollTrigger: {
      trigger: section1Text,
      end: "bottom 25%",
      scrub: 2,
      snap: {
        snapTo: 1,
        ease: "power3",
      },
      markers: true,
      onEnter: (_self) => {
        woPhone.toggleFloat(false);
      },
      onEnterBack: (_self) => {
        woPhone.toggleFloat(false);
      },
      onLeave: (_self) => {
        woPhone.toggleFloat(true);
      },
      onLeaveBack: (_self) => {
        woPhone.toggleFloat(true);
      },
      onUpdate: (self) => {
        woPhone.threeObject.rotation.set(
          gsap.utils.interpolate(originalPhoneRotation.x, -3.3, self.progress),
          gsap.utils.interpolate(originalPhoneRotation.y, -0.6, self.progress),
          gsap.utils.interpolate(originalPhoneRotation.z, -0.1, self.progress),
        );
        // if (self.progress > 0.95) {
        //   woPhone.toggleFloat(true);
        // }
      },
    },
    xPercent: -100,
    ease: "power1.out",
  });
}
