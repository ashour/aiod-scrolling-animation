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
  hasLabels: boolean;
  labelPositioners: Array<() => void>;
  phoneTransforms?: PhoneTransforms;
  showMarkers?: boolean;
};

export function makeSectionAnimation({
  id,
  start,
  end,
  phone,
  hasLabels,
  labelPositioners,
  phoneTransforms,
  showMarkers = false,
}: MakeSectionAnimationParams) {
  const timeline = gsap.timeline({
    scrollTrigger: {
      id,
      trigger: `#${id}`,
      start,
      end,
      scrub: 0.13,
      snap: {
        snapTo: 1,
        ease: "expo",
        duration: { min: 0.5, max: 0.7 },
      },
      markers: showMarkers,
      onRefresh: (_self) => {
        labelPositioners.forEach((lp) => lp());
      },
    },
  });

  const nextSectionIndex = parseInt(id.replace("section-", ""));
  const currentSectionIndex = nextSectionIndex - 1;
  const currentSectionHeaderId = `#section-${currentSectionIndex}-header`;

  const phoneAnimationProgress = { value: 0 };

  timeline
    .addLabel("currentHeaderDown")
    .to(currentSectionHeaderId, { y: "100vh", duration: 2, ease: "power1.out" })
    .addLabel("phone");

  if (phoneTransforms) {
    const targetPosition = responsivePosition(phoneTransforms);

    if (targetPosition) {
      timeline.to(
        phone.threeObject.position,
        {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: 10,
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
          duration: 10,
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

  if (hasLabels) {
    const nextSectionLabelSelector = `#section-${nextSectionIndex}-labels .part-label`;
    timeline
      .addLabel("labels")
      .to(nextSectionLabelSelector, { "--label-scale": 1, duration: 1, ease: "power1.out" });
  }

  const nextSectionHeaderId = `#section-${nextSectionIndex}-header`;

  timeline
    .addLabel("nextHeaderUp")
    .to(
      nextSectionHeaderId,
      { y: 0, duration: 1, ease: "power1.out" },
      hasLabels ? "<" : undefined,
    );
}

function responsivePosition(transforms: PhoneTransforms) {
  const isLargeScreen = browserWindow.mediaQueryMatches(
    `(min-width: ${LARGE_SCREEN_BREAKPOINT_PX}px)`,
  );
  return isLargeScreen && transforms.positionLg ? transforms.positionLg : transforms.position;
}
