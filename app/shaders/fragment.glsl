precision highp float;

uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec4 map = texture2D(tMap, vUv);

  gl_FragColor = vec4(map);
}

// TODO: Implement the RGB color distortion
