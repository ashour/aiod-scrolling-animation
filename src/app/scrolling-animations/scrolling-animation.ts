import type { makePhone } from "@/app/phone/phone";
import { LARGE_SCREEN_BREAKPOINT_PX } from "@/config/app";
import { browserWindow } from "@/engine/system/browser-window";
import gsap from "gsap";

type PhoneTransforms = {
  position?: { x: number; y: number; z: number };
  positionLg?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
};

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

function parseTransformData(element: Element): PhoneTransforms {
  const transforms: PhoneTransforms = {};

  const position = element.getAttribute("data-phone-position");
  if (position) {
    const [x, y, z] = position.split(",").map(Number);
    transforms.position = { x, y, z };
  }

  const positionLg = element.getAttribute("data-phone-position-lg");
  if (positionLg) {
    const [x, y, z] = positionLg.split(",").map(Number);
    transforms.positionLg = { x, y, z };
  }

  const rotation = element.getAttribute("data-phone-rotation");
  if (rotation) {
    const [x, y, z] = rotation.split(",").map(Number);
    transforms.rotation = { x, y, z };
  }

  return transforms;
}

function getResponsivePosition(transforms: PhoneTransforms) {
  const isLargeScreen = browserWindow.mediaQueryMatches(
    `(min-width: ${LARGE_SCREEN_BREAKPOINT_PX}px)`,
  );
  return isLargeScreen && transforms.positionLg ? transforms.positionLg : transforms.position;
}

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

  // Add phone transform animations if provided
  if (phoneTransforms) {
    const targetPosition = getResponsivePosition(phoneTransforms);

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

  // Phone animation timeline
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

export { parseTransformData };
