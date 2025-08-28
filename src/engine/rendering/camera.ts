import * as THREE from "three";

type PerspectiveCameraParams = {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  position: THREE.Vector3 | null;
};

export function makePerspectiveCamera(args: PerspectiveCameraParams): WorldCamera {
  const threeObject = new THREE.PerspectiveCamera(args.fov, args.aspect, args.near, args.far);

  if (args.position) {
    threeObject.position.set(args.position.x, args.position.y, args.position.z);
  }

  return {
    threeObject,
    setAspect(newAspect: number) {
      threeObject.aspect = newAspect;
      threeObject.updateProjectionMatrix();
    },
    dispose() {},
  };
}

type FitOptions = {
  padding?: number;
  fillX?: number;
  fillY?: number;
  prefer?: "contain" | "width" | "height";
};

export function fitCameraToBox(
  camera: THREE.PerspectiveCamera,
  box: THREE.Box3,
  opts: FitOptions = {},
): void {
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);

  const halfX = size.x / 2;
  const halfY = size.y / 2;
  const halfZ = size.z / 2;

  const fillX = THREE.MathUtils.clamp(opts.fillX ?? 1, 0.1, 1);
  const fillY = THREE.MathUtils.clamp(opts.fillY ?? 1, 0.1, 1);

  const verticalDistance = halfY / (Math.tan(verticalFov / 2) * fillY) + halfZ;
  const horizontalDistance = halfX / (Math.tan(horizontalFov / 2) * fillX) + halfZ;

  let distance: number;
  switch (opts.prefer ?? "contain") {
    case "width":
      distance = horizontalDistance;
      break;
    case "height":
      distance = verticalDistance;
      break;
    default:
      distance = Math.max(horizontalDistance, verticalDistance);
  }

  // Avoid clipping on the non-preferred axis
  distance = Math.max(distance, horizontalDistance, verticalDistance);

  const padding = THREE.MathUtils.clamp(opts.padding ?? 1, 0.01, 10);

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  const newPosition = center.clone().sub(direction.multiplyScalar(distance * padding));
  camera.position.copy(newPosition);
  camera.lookAt(center);

  camera.updateProjectionMatrix();
}
