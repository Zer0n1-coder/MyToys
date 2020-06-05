import { mat4 } from "./gl-matrix-ts/index";
import { Widget } from "./Widget";

export let canvas = <HTMLCanvasElement>document.getElementById('webgl');
export let gl = <WebGL2RenderingContext>canvas.getContext("webgl2");
export const SCR_WIDTH = canvas.width;
export const SCR_HEIGHT = canvas.height;
export let mouseupQueue = new Array<MouseEvent>();
export let mousedownQueue = new Array<MouseEvent>();
export let mousemoveQueue = new Array<MouseEvent>();
export let curCoord = [0,0];

export let projection = mat4.ortho(mat4.create(),0.0, SCR_WIDTH, SCR_HEIGHT, 0.0, -1.0, 1.0);
export let renderObjects = new Array<Widget>();
export let originZbuffer = -0.5;
export function changeZbuffer(){
    originZbuffer += 0.01;
}
export let topZbuffer = -1;
export function setTopbuffer(z : number){
    topZbuffer = z;
}
export function resetTopbuffer(){
    topZbuffer = -1;
}
