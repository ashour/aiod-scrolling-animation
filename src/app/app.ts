import assets from "@/config/assets";
import engineOptions from "@/config/engine";
import engine from "@/engine";
import { axesWidget } from "@/engine/debug/axes-widget";
import { browserWindow } from "@/engine/system/browser_window";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GUI from "lil-gui";
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

  const gui = new GUI();

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
      // (aMainScene.threeObject as THREE.Scene).environmentRotation = new THREE.Euler(-0.08, 4.42, 0);
      // const envFolder = gui.addFolder("Environment");
      // envFolder
      //   .add(debug, "envIntensity", 0, 3, 0.1)
      //   .onChange(
      //     (val: number) => ((aMainScene.threeObject as THREE.Scene).environmentIntensity = val),
      //   );
      // envFolder
      //   .add(debug, "envRotX", -Math.PI * 2, Math.PI * 2, 0.1)
      //   .onChange(
      //     (val: number) => ((aMainScene.threeObject as THREE.Scene).environmentRotation.x = val),
      //   );
      // envFolder
      //   .add(debug, "envRotY", -Math.PI * 2, Math.PI * 2, 0.1)
      //   .onChange(
      //     (val: number) => ((aMainScene.threeObject as THREE.Scene).environmentRotation.y = val),
      //   );
      // envFolder
      //   .add(debug, "envRotZ", -Math.PI * 2, Math.PI * 2, 0.1)
      //   .onChange(
      //     (val: number) => ((aMainScene.threeObject as THREE.Scene).environmentRotation.z = val),
      //   );

      // (aMainScene.threeObject as THREE.Scene).background = envMap;
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

  let piece1AnimatingAverageWorldPos = new THREE.Vector3(-7.877, -8.702, 1.957);
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
    label0.style.setProperty("--label0-translateY", `${piece1ScreenPosY + 80}px`);
  }
  positionLabel0();
  engine.onWindowResize(positionLabel0);

  const section0 = document.querySelector("#section-0");
  gsap.from(section0, { xPercent: -100, duration: 0.5, ease: "power1.out" });

  const section1Text = document.querySelector("#section-1 .section__text");
  let section1Timeline = gsap.timeline({
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
        woPhone.setAnimationTime(0, self.progress);
      },
    },
  });
  section1Timeline.from(section1Text, {
    xPercent: -100,
    ease: "power1.out",
  });

  section1Timeline.to(label0, { "--label0-scale": 1 });

  // ---------------

  const section2Text = document.querySelector("#section-2 .section__text");
  let section2Timeline = gsap.timeline({
    scrollTrigger: {
      id: "section-1",
      trigger: section2Text,
      end: "bottom 25%",
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
  section2Timeline.from(section1Text, {
    xPercent: -100,
    ease: "power1.out",
  });
}
