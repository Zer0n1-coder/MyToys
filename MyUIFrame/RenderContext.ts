import { Shader } from "./Shader";
import { mat4 } from "./gl-matrix-ts/index";
import { loadTextureFromFile } from "./Tools";

export let canvas = <HTMLCanvasElement>document.getElementById('webgl');
export let gl = <WebGL2RenderingContext>canvas.getContext("webgl2");
export const SCR_WIDTH = canvas.width;
export const SCR_HEIGHT = canvas.height;
export let mouseupQueue = new Array<MouseEvent>();
export let mousedownQueue = new Array<MouseEvent>();
export let mousemoveQueue = new Array<MouseEvent>();
export let globalShader = new Shader('./res/widget.vs', './res/widget.frag');
export let desktopShader = new Shader("./res/desktop.vs","./res/desktop.frag");
export let desktopTexture =loadTextureFromFile("background",false);
export let projection = mat4.ortho(mat4.create(),0.0, SCR_WIDTH, SCR_HEIGHT, 0.0, -1.0, 1.0);