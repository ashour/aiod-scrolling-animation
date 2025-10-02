import type { makePhone } from "@/app/phone/phone";
import { LARGE_SCREEN_BREAKPOINT_PX } from "@/config/app";
import { browserWindow } from "@/engine/system/browser-window";
import gsap from "gsap";
import type { PhoneTransforms } from "./parse-phone-transform-data";

type MakeSectionAnimationParams = {
  id: string;
  start: string;
  end: string;
  phone: ReturnType<typeof makePhone>;
  currentSectionHasLabels: boolean;
  nextSectionHasLabels: boolean;
  labelPositioners: Array<() => void>;
  phoneTransforms?: PhoneTransforms;
  showMarkers?: boolean;
};

export function makeSectionAnimation({
  id,
  start,
  end,
  phone,
  currentSectionHasLabels,
  nextSectionHasLabels,
  labelPositioners,
  phoneTransforms,
  showMarkers = false,
}: MakeSectionAnimationParams) {
  const timeline = gsap
    .timeline({
      duration: 10,
      scrollTrigger: {
        id,
        trigger: `#${id}`,
        start,
        end,
        scrub: 0.25,
        markers: showMarkers,
        onRefresh: (_self) => {
          labelPositioners.forEach((lp) => lp());
        },
      },
    })
    .addLabel("phone", 0);

  const nextSectionIndex = parseInt(id.replace("section-", ""));
  const currentSectionIndex = nextSectionIndex - 1;
  const currentSectionHeaderId = `#section-${currentSectionIndex}-header`;

  const phoneAnimationProgress = { value: 0 };

  if (phoneTransforms) {
    const targetPosition = responsivePosition(phoneTransforms);

    if (targetPosition) {
      timeline.to(
        phone.threeObject.position,
        {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: 8,
          ease: "power1.out",
        },
        "phone",
      );
    }

    if (phoneTransforms.rotation) {
      timeline.to(
        phone.threeObject.rotation,
        {
          x: phoneTransforms.rotation.x,
          y: phoneTransforms.rotation.y,
          z: phoneTransforms.rotation.z,
          duration: 8,
          ease: "power1.out",
        },
        "phone",
      );
    }
  }

  timeline.to(
    phoneAnimationProgress,
    {
      value: 1,
      duration: 8,
      ease: "none",
      onUpdate: () => {
        phone.setAnimationTime(currentSectionIndex, phoneAnimationProgress.value);
      },
    },
    "phone",
  );

  if (nextSectionHasLabels) {
    const nextSectionLabelSelector = `#section-${nextSectionIndex}-labels .part-label`;
    timeline.addLabel("labels").to(
      nextSectionLabelSelector,
      {
        "--label-scale": 1,
        duration: 1.5,
        delay: 8,
        ease: "power1.out",
      },
      "phone",
    );
  }
  if (currentSectionHasLabels) {
    const currentSectionLabelSelector = `#section-${currentSectionIndex}-labels .part-label`;
    timeline.to(
      currentSectionLabelSelector,
      {
        "--label-scale": 0,
        duration: 2,
        delay: 2,
        ease: "power1.out",
      },
      "phone",
    );
  }

  timeline
    .addLabel("headers")
    .to(currentSectionHeaderId, { y: "100vh", duration: 3, delay: 5, ease: "power1.out" }, "phone");

  const nextSectionHeaderId = `#section-${nextSectionIndex}-header`;

  timeline
    .addLabel("nextHeaderUp")
    .to(nextSectionHeaderId, { y: 0, duration: 2, delay: 8, ease: "power1.out" }, "phone");
}

function responsivePosition(transforms: PhoneTransforms) {
  const isLargeScreen = browserWindow.mediaQueryMatches(
    `(min-width: ${LARGE_SCREEN_BREAKPOINT_PX}px)`,
  );
  return isLargeScreen && transforms.positionLg ? transforms.positionLg : transforms.position;
}
