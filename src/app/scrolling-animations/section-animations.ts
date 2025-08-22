import engine from "@/engine";
import type { makePhone } from "../phone/phone";
import { makeLabelPositionerFor } from "./position-label";
import { makeSectionAnimation } from "./scrolling-animation";

export function makeSectionAnimations(phone: ReturnType<typeof makePhone>, camera: WorldCamera) {
  document.querySelectorAll(".section-scroll-controllers > .section")!.forEach((section) => {
    if (section.hasAttribute("data-no-animation")) {
      return;
    }

    const hasLabels = section.hasAttribute("data-has-labels");
    if (hasLabels) {
      document.querySelectorAll(`#${section.id}-labels .part-label`)!.forEach((label) => {
        const positionLabel = makeLabelPositionerFor(label as HTMLElement, camera);
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
