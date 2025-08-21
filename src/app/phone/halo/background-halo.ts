import worldObject from "@/engine/world/world-object";
import * as THREE from "three";
import fragmentShader from "./background-halo.frag?raw";
import vertexShader from "./background-halo.vert?raw";

const SIZE = 20;
const SEGMENT_COUNT = 32;
const COLOR = "#C4D6E6";
const INNER_RADIUS = 0;
const OUTER_RADIUS = 0.35;
const INTENSITY = 0.35;
const FEATHER = 0.25;

export function makeBackgroundHalo(): WorldObject {
  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENT_COUNT, SEGMENT_COUNT);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    glslVersion: "300 es",
    uniforms: {
      color: { value: new THREE.Color(COLOR) },
      innerRadius: { value: INNER_RADIUS },
      outerRadius: { value: OUTER_RADIUS },
      intensity: { value: INTENSITY },
      feather: { value: FEATHER },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  return worldObject(new THREE.Mesh(geometry, material), {});
}
