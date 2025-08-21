import * as THREE from "three";

type PerspectiveCameraParams = {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  position: THREE.Vector3 | null;
};

export function perspectiveCamera(args: PerspectiveCameraParams): WorldCamera {
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
