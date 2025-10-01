import type { makePhone } from "../phone/phone";
import { parseTransformData } from "./parse-phone-transform-data";
import { makeLabelPositionerFor } from "./position-label";
import { makeSectionAnimation } from "./scrolling-animation";

export function makeSectionAnimations(phone: ReturnType<typeof makePhone>, camera: WorldCamera) {
  document.querySelectorAll(".section-scroll-controllers > .section")!.forEach((section) => {
    if (section.hasAttribute("data-no-animation")) {
      return;
    }

    const hasLabels = section.hasAttribute("data-has-labels");
    const phoneTransforms = parseTransformData(section);
    const labelPositioners: Array<() => void> = [];
    if (hasLabels) {
      document.querySelectorAll(`#${section.id}-labels .part-label`)!.forEach((label) => {
        const positionLabel = makeLabelPositionerFor(label as HTMLElement, camera);
        positionLabel();
        labelPositioners.push(positionLabel);
      });
    }

    makeSectionAnimation({
      id: section.id,
      start: section.getAttribute("data-start")!,
      end: section.getAttribute("data-end")!,
      phone,
      hasLabels,
      labelPositioners,
      phoneTransforms,
      showMarkers: true,
    });
  });
}
