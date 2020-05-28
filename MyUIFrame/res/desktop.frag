#version 300 es
precision mediump float;

in vec2 TexCoords;

out vec4 FragColor;

uniform sampler2D desktop;

void main()
{
    FragColor = texture(desktop, TexCoords);
}