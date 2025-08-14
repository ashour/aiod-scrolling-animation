import worldObject from "@/engine/world/world-object";
import * as THREE from "three";
import fragmentShader from "./shaders/background-halo.frag?raw";
import vertexShader from "./shaders/background-halo.vert?raw";

export function backgroundHalo(): WorldObject {
  const geometry = new THREE.PlaneGeometry(20, 20, 32, 32);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    glslVersion: "300 es",
    uniforms: {
      color: { value: new THREE.Color("#C4D6E6") },
      innerRadius: { value: 0 },
      outerRadius: { value: 0.35 },
      intensity: { value: 0.35 },
      feather: { value: 0.25 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  return worldObject(new THREE.Mesh(geometry, material), {});
}
