import type { makePhone } from "../phone/phone";
import { addLabelPositionersForSection } from "./label-positioners";
import { parseTransformData } from "./parse-phone-transform-data";
import { makeSectionAnimation } from "./scrolling-animation";

export function makeSectionAnimations(phone: ReturnType<typeof makePhone>, camera: WorldCamera) {
  const sections = Array.from(document.querySelectorAll(".section-scroll-controllers > .section")!);

  sections.forEach((section, index) => {
    if (section.hasAttribute("data-no-animation")) {
      return;
    }

    const labelPositioners: Array<() => void> = [];
    const nextSectionHasLabels = section.hasAttribute("data-has-labels");
    if (nextSectionHasLabels) {
      addLabelPositionersForSection(section.id, camera, labelPositioners);
    }
    const currentSection = index > 0 ? sections[index - 1] : null;
    const currentSectionHasLabels = currentSection?.hasAttribute("data-has-labels") ?? false;
    if (currentSectionHasLabels) {
      addLabelPositionersForSection(sections[index - 1].id, camera, labelPositioners);
    }

    const phoneTransforms = parseTransformData(section);

    makeSectionAnimation({
      id: section.id,
      start: section.getAttribute("data-start")!,
      end: section.getAttribute("data-end")!,
      phone,
      currentSectionHasLabels,
      nextSectionHasLabels,
      labelPositioners,
      phoneTransforms,
      showMarkers: true,
    });
  });
}
