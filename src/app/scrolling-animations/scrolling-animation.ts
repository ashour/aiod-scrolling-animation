import type { makePhone } from "@/app/phone/phone";
import gsap from "gsap";

type MakeSectionAnimationParams = {
  id: string;
  start: string;
  end: string;
  phone: ReturnType<typeof makePhone>;
  hasLabels: boolean;
  labelPositioners: Array<() => void>;
  showMarkers?: boolean;
};

export function makeSectionAnimation({
  id,
  start,
  end,
  phone,
  hasLabels,
  labelPositioners,
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
        duration: { max: 1 },
      },
      markers: showMarkers,
      onEnter: (_self) => {
        phone.stopFloating();
        labelPositioners.forEach((lp) => lp());
      },
      onEnterBack: (_self) => {
        phone.stopFloating();
        labelPositioners.forEach((lp) => lp());
      },
      onLeave: (_self) => phone.startFloating(),
      onLeaveBack: (_self) => phone.startFloating(),
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
    .addLabel("phone")
    .to(phoneAnimationProgress, {
      value: 1,
      duration: 6,
      ease: "none",
      onUpdate: () => {
        phone.setAnimationTime(currentSectionIndex, phoneAnimationProgress.value);
      },
    });

  if (hasLabels) {
    const nextSectionLabelSelector = `#section-${nextSectionIndex}-labels .part-label`;
    timeline
      .addLabel("labels")
      .to(nextSectionLabelSelector, { "--label-scale": 1, duration: 2, ease: "power1.out" });
  }

  const nextSectionHeaderId = `#section-${nextSectionIndex}-header`;

  timeline
    .addLabel("nextHeaderUp")
    .to(
      nextSectionHeaderId,
      { y: 0, duration: 2, ease: "power1.out" },
      hasLabels ? "<" : undefined,
    );
}
