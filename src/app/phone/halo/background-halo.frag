uniform vec3 color;
uniform float innerRadius;
uniform float outerRadius;
uniform float intensity;
uniform float feather;

in vec2 vUv;
out vec4 fragColor;

void main() {
  float dist = length(vUv - vec2(0.5));

  float validInnerRadius = max(innerRadius, 0.0);
  float validOuterRadius = max(outerRadius, validInnerRadius + 1e-5);

  float smoothFalloff =
      clamp(feather, 0.0, 1.0) * (validOuterRadius - validInnerRadius);
  float alpha = 1.0 - smoothstep(validInnerRadius,
                                 validOuterRadius + smoothFalloff, dist);

  alpha = pow(alpha, 1.2);

  vec3 rgb = color * intensity * alpha;
  fragColor = vec4(rgb, alpha);
}
