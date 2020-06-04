import { Shader } from "./Shader";
import { mat4 } from "./gl-matrix-ts/index";
import { loadTextureFromFile } from "./Tools";
export let canvas = document.getElementById('webgl');
export let gl = canvas.getContext("webgl2");
export const SCR_WIDTH = canvas.width;
export const SCR_HEIGHT = canvas.height;
export let mouseupQueue = new Array();
export let mousedownQueue = new Array();
export let mousemoveQueue = new Array();
export let curCoord = [0, 0];
export let widgetShader = new Shader('./res/widget.vs', './res/widget.frag');
export let desktopShader = new Shader("./res/desktop.vs", "./res/desktop.frag");
export let desktopTexture = loadTextureFromFile("background", false);
export let projection = mat4.ortho(mat4.create(), 0.0, SCR_WIDTH, SCR_HEIGHT, 0.0, -1.0, 1.0);
export let renderObjects = new Array();
export let originZbuffer = -0.5;
export function changeZbuffer() {
    originZbuffer += 0.01;
}
export let topZbuffer = -1;
export function setTopbuffer(z) {
    topZbuffer = z;
}
export function resetTopbuffer() {
    topZbuffer = -1;
}
