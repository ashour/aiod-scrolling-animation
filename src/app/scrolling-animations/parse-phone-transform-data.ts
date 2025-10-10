export type PhoneTransforms = {
  position?: { x: number; y: number; z: number };
  positionLg?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
};

export function parseTransformData(element: Element): PhoneTransforms {
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
