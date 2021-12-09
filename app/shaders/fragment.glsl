precision highp float;

uniform sampler2D tMap;

uniform float uOffset;

varying vec2 vUv;

void main() {
  float red = texture2D(tMap, vUv + uOffset * 0.0001).r;
  vec2 gb = texture2D(tMap, vUv).gb;

  gl_FragColor = vec4(red, gb, 1.);
}

// TODO: Implement the RGB color distortion
