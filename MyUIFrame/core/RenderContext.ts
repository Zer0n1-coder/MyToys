import { mat4 } from "../gl-matrix-ts/index";
import { Widget } from "./Widget";

export let canvas = <HTMLCanvasElement>document.getElementById('webgl');
export let gl = <WebGL2RenderingContext>canvas.getContext("webgl2");
export const SCR_WIDTH = canvas.width;
export const SCR_HEIGHT = canvas.height;

class RenderContext{
    mouseupQueue = new Array<MouseEvent>();
    mousedownQueue = new Array<MouseEvent>();
    mousemoveQueue = new Array<MouseEvent>();
    curCoord = [0,0];
    projection = mat4.ortho(mat4.create(),0.0, SCR_WIDTH, SCR_HEIGHT, 0.0, -1.0, 1.0);
    renderObjects = new Array<Widget>();
    originZbuffer = -0.5;
    topZbuffer = -1;
}

export let global = new RenderContext();

//export function changeZbuffer(){
//    originZbuffer += 0.01;
//}

//export function setTopbuffer(z : number){
//    topZbuffer = z;
//}
//export function resetTopbuffer(){
//    topZbuffer = -1;
//}
