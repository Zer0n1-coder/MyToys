#version 300 es
layout (location = 0) in vec4 vertex;

uniform mat4 model;
uniform mat4 projection;
uniform float zbuffer;

void main()
{
    gl_Position = projection * model * vec4(vertex.xy, zbuffer, 1.0);
}