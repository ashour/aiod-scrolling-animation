import assets from "@/config/assets";
import engineOptions from "@/config/engine";
import engine from "@/engine";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { makeAmbientLight } from "./ambient-light";
import { makeDirectionalLight } from "./directional-light";
import { makeLabelPositionerFor } from "./labels/position-label";
import { makeMainCamera } from "./main-camera";
import { makeMainScene } from "./main-scene";
import { makePhone } from "./phone/phone";
import { makeSectionAnimation } from "./scrolling-animation";

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

  // TODO move to engine
  function makeDebugMarker(position: THREE.Vector3, size = 0.24, color = 0xff0000) {
    const geo = new THREE.SphereGeometry(size, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color, depthTest: false, depthWrite: false });
    const marker = new THREE.Mesh(geo, mat);
    marker.position.copy(position);
    marker.renderOrder = 999;
    marker.frustumCulled = false;
    return marker;
  }

  mainScene.threeObject.add(makeDebugMarker(new THREE.Vector3(-7.877, -4.702, 1.957)));
  mainScene.threeObject.add(makeDebugMarker(new THREE.Vector3(7.877, -4.702, 1.957)));

  document.querySelectorAll(".section-scroll-controllers > .section")!.forEach((section) => {
    if (section.hasAttribute("data-no-animation")) {
      return;
    }

    const hasLabels = section.hasAttribute("data-has-labels");
    if (hasLabels) {
      document.querySelectorAll(`#${section.id}-labels .part-label`)!.forEach((label) => {
        const positionLabel = makeLabelPositionerFor(label as HTMLElement, mainCamera);
        positionLabel();
        engine.onWindowResize(positionLabel);
      });
    }

    makeSectionAnimation({
      id: section.id,
      start: section.getAttribute("data-start")!,
      end: section.getAttribute("data-end")!,
      hasLabels,
      phone,
      showMarkers: false,
    });
  });
}
