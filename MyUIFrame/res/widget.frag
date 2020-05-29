#version 300 es
precision mediump float;

in vec2 TexCoords;

out vec4 FragColor;

uniform vec4 color;

void main()
{
    FragColor = color;
}