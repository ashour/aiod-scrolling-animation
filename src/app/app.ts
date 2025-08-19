import assets from "@/config/assets";
import engineOptions from "@/config/engine";
import engine from "@/engine";
import { axesWidget } from "@/engine/debug/axes-widget";
import { browserWindow } from "@/engine/system/browser_window";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { keyLight } from "./key-light";
import { mainCamera } from "./main-camera";
import { mainScene } from "./main-scene";
import { phone } from "./phone";

gsap.registerPlugin(ScrollTrigger);

const debug = {
  envIntensity: 0.2,
  envRotX: 0.0168146928204145,
  envRotY: 2.11681469282041,
  envRotZ: 0.916814692820414,
};

export async function app(canvas: HTMLCanvasElement) {
  await engine.init(canvas, assets, engineOptions);

  // const gui = new GUI();

  const aMainScene = mainScene();
  engine.setMainScene(aMainScene);

  const pmrem = new THREE.PMREMGenerator(engine.renderer.threeRenderer);
  pmrem.compileEquirectangularShader();

  new RGBELoader()
    .setPath("/environment-maps/")
    .load("bloem_field_sunrise_2k.hdr", (hdrEquirect) => {
      const envMap = pmrem.fromEquirectangular(hdrEquirect).texture;
      hdrEquirect.dispose();
      pmrem.dispose();
      (aMainScene.threeObject as THREE.Scene).environment = envMap;
      (aMainScene.threeObject as THREE.Scene).environmentIntensity = 0.25;
    });

  const aMainCamera = mainCamera();
  aMainScene.add(aMainCamera);
  engine.setMainCamera(aMainCamera);

  aMainScene.add(axesWidget(8));

  aMainScene.add(keyLight());

  const woPhone = phone();
  aMainScene.add(woPhone);

  engine.run();

  let floatingTween: gsap.core.Tween | null = null;
  let rotationTween: gsap.core.Tween | null = null;

  function startFloating() {
    if (floatingTween) {
      floatingTween.kill();
    }
    if (rotationTween) {
      rotationTween.kill();
    }

    floatingTween = gsap.to(woPhone.threeObject.position, {
      y: "+=0.5",
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    rotationTween = gsap.to(woPhone.threeObject.rotation, {
      x: "+=0.0625",
      z: "+=0.03125",
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  function stopFloating() {
    if (floatingTween) {
      floatingTween.kill();
      floatingTween = null;
    }
    if (rotationTween) {
      rotationTween.kill();
      rotationTween = null;
    }
  }

  startFloating();

  let piece1AnimatingAverageWorldPos = new THREE.Vector3(-7.877, -10.702, 1.957);
  const label0 = document.getElementById("label-1-0")!;
  function positionLabel0() {
    const halfWindowWidth = browserWindow.width / 2;
    const halfWindowHeight = browserWindow.height / 2;

    const halfLabel0Width = label0.offsetWidth / 2;

    let piece1AverageWorldPos = piece1AnimatingAverageWorldPos.clone();
    piece1AverageWorldPos.project(aMainCamera.threeObject as THREE.Camera);

    const piece1ScreenPosX = piece1AverageWorldPos.x * halfWindowWidth + halfWindowWidth;
    const piece1ScreenPosY = -piece1AverageWorldPos.y * halfWindowHeight + halfWindowHeight;
    label0.style.setProperty("--label0-translateX", `${piece1ScreenPosX - halfLabel0Width}px`);
    label0.style.setProperty("--label0-translateY", `${piece1ScreenPosY - 200}px`);
  }
  positionLabel0();
  engine.onWindowResize(positionLabel0);

  const section1 = document.querySelector("#section-1");
  let section1Timeline = gsap.timeline({
    scrollTrigger: {
      id: "section-1",
      trigger: section1,
      start: "top 99%",
      end: "top 1%",
      scrub: 1,
      snap: {
        snapTo: 1,
        ease: "none",
      },
      markers: false,
      onEnter: (_self) => {
        stopFloating();
      },
      onEnterBack: (_self) => {
        stopFloating();
      },
      onLeave: (_self) => {
        startFloating();
      },
      onLeaveBack: (_self) => {
        startFloating();
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
        woPhone.setAnimationTime(0, section1PhoneAnimationProgress.value);
      },
    })
    .addLabel("labels")
    .addLabel("nextHeaderUp")
    .to(label0, { "--label0-scale": 1, duration: 2, ease: "power1.out" })
    .to("#section-1-header", { y: 0, duration: 2, ease: "power1.out" }, "<");

  let section2Timeline = gsap.timeline({
    scrollTrigger: {
      id: "section-2",
      trigger: "#section-2",
      start: "+=200 99%",
      end: "top 1%",
      scrub: 1,
      snap: {
        snapTo: 1,
        ease: "power3",
      },
      markers: true,
      onEnter: (_self) => {
        stopFloating();
      },
      onEnterBack: (_self) => {
        stopFloating();
      },
      onLeave: (_self) => {
        startFloating();
      },
      onLeaveBack: (_self) => {
        startFloating();
      },
      onUpdate: (self) => {
        woPhone.setAnimationTime(1, self.progress);
      },
    },
  });
  section2Timeline.to("#section-1-header", { xPercent: 220, duration: 0.5, ease: "power1.out" });
  section2Timeline.to(
    "#section-2-header",
    { xPercent: 110, duration: 0.5, ease: "power1.out" },
    "<",
  );
}
