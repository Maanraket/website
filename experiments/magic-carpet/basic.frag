precision mediump float;

varying vec2 vTexCoord;
uniform float counter;
uniform float ratio;
uniform vec2 mouse;
uniform float zoom;


void main() {
  vec2 coord = vec2(vTexCoord.x + sin(counter / 1000.) * 0.1, 0.5 + ratio * (vTexCoord.y - 0.5) + cos(counter / 1000.) * 0.1);

  vec2 center = vec2(
    (mouse.x - 0.5), 
    abs((1.0 - mouse.y))
  );

  float circleDist = distance(center, coord);
  float dist = (sin(counter / 100.) * 0.5 + 0.6) * circleDist;
  float i = (cos(counter / 100.0) + 1.) * 5.
   + sin((coord.x - 0.5) * (cos(counter / 300.) + 2. + zoom) * 100. * dist) * 10. + 10.
   + cos((coord.y - 0.5) * (sin(counter / 300.) + 2. + zoom) * 100. * dist) * 10. + 10.;

  vec3 color = vec3(
      (sin(i + 0.5 * 3.14) + 0.7) * tan(i + 0.5 * 3.14) * 0.5 + 0.5,  
      (sin(i + 1.0 * 3.14) + 0.7) * tan(i + 1.0 * 3.14) * 0.5 + 0.5,
      (sin(i + 1.5 * 3.14) + 0.7) * tan(i + 1.5 * 3.14) * 0.5 + 0.5
    );

  gl_FragColor = vec4(color, 1.0);
}