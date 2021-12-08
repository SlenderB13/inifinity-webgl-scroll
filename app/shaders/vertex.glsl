#define PI 3.1415926535897932384626433832795

attribute vec3 position;
attribute vec2 uv;

uniform vec2 uViewportSizes;

uniform float uSpeed;
uniform float uOffset;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

/* vec3 deformation(vec3 position, vec2 uv, float offset) {
  position.x = position.x + (sin(uv.y * PI) * offset) * 0.0006;

  return position;
} */

void main() {
  vUv = uv;

  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);
/*   vec3 newPosition = deformation(position, vUv, uOffset); */


  newPosition.z += sin(newPosition.x / uViewportSizes.y - PI / 2.0) * abs(uOffset * 0.009);

/*   newPosition.z += sin(newPosition.y / uViewportSizes.y * PI + PI/ 2.0) * abs(uSpeed); */
/*   newPosition.z += (sin(newPosition.y / uViewportSizes.x * PI + PI/ 2.0)); */

  gl_Position = projectionMatrix * newPosition;
/*   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.); */
}
// TODO: MAKE THE SCROLL CURRENT BE 0.
