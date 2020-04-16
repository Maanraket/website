precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_buffer0;
uniform sampler2D u_buffer1;
const float PI = 3.1415926535897932384626433832795;
const vec2 middle = vec2(.5, .5);

float rand(vec2 co){
    return fract(sin(dot(co ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 warp(vec2 coords) {
    float distFromMiddle = abs(distance(coords, middle));
    vec2 relMouse = u_mouse / u_resolution - middle;
    return vec2(
        coords.x * (1. + distFromMiddle * relMouse.x * sin(u_time) * 4.), 
        coords.y * (1. + distFromMiddle * relMouse.y * sin(u_time * 1.6) * 4.)
        );
}

vec2 twist(vec2 coords) {
    float distFromMiddle = abs(distance(coords, middle));
    vec2 relMouse = u_mouse / u_resolution - middle;
    return vec2(coords.x, coords.y + relMouse.y / 3. * distFromMiddle);
}

#if defined(BUFFER_0)
    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float brightness = sin((st.x - u_time / 2.5) * 1. + rand(vec2(st.y)) * 200.);
        vec3 stripe = vec3(brightness);
        if (brightness < 0.9995) {
            stripe = vec3(0.);
        }

        gl_FragColor = vec4(stripe, 1.);
    }
#elif defined(BUFFER_1)
    void main() {
        vec2 st = twist(gl_FragCoord.xy / u_resolution.xy);
        vec3 currentColor = texture2D(u_buffer0, st, 0.0).rgb;
        // dist = min(dist, distance(st, vec2(coc.x, coc.y -1.)));
        float r =  sin(st.x * 10. - u_time * 5.1);
        float g =  sin(st.x * 20. - u_time * 9.1);
        float b =  sin(st.x * 400. - u_time * 12.1);
        vec3 color = vec3(0);
        if (r + b > .9) {
            color = vec3(r, g, b);
        }

        gl_FragColor = vec4(currentColor + color, 1.0);
    }
#else

    void main() {
        vec2 st = warp(gl_FragCoord.xy / u_resolution.xy);

        float distanceToMiddle = pow(distance(st, middle), .25);
        float angleToMiddle = atan(st.y - middle.y, middle.x - st.x);

        vec2 newPosition = vec2(distanceToMiddle, (angleToMiddle + PI) / (2. * PI));

        vec3 color = vec3(0.0);
        float brightness = abs(sin(newPosition.x * 80. + u_time * 10.));
        color = texture2D(u_buffer1, newPosition, 0.0).rgb;
        // Uncomment if you just want to see the first buffer
        // color = texture2D(u_buffer1, st, 0.0).rgb;
        gl_FragColor = vec4(color, 1.0);
    }
#endif
