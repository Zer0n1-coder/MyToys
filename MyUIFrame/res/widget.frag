#version 300 es
precision mediump float;

in vec2 TexCoords;

out vec4 FragColor;

uniform vec3 spriteColor;

void main()
{
    FragColor = vec4(0.3804, 0.8235, 0.9333, 0.404);
}