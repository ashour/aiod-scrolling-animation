import { makeLabelPositionerFor } from "./position-label";

/**
 * Adds label positioners for a section to the labelPositioners array
 */
export function addLabelPositionersForSection(
  sectionId: string,
  camera: WorldCamera,
  labelPositioners: Array<() => void>,
): void {
  document.querySelectorAll(`#${sectionId}-labels .part-label`)!.forEach((label) => {
    const positionLabel = makeLabelPositionerFor(label as HTMLElement, camera);
    positionLabel();
    labelPositioners.push(positionLabel);
  });
}
