import { mat4 } from "../gl-matrix-ts/index";
export let canvas = document.getElementById('webgl');
export let gl = canvas.getContext("webgl2");
export const SCR_WIDTH = canvas.width;
export const SCR_HEIGHT = canvas.height;
class RenderContext {
    constructor() {
        this.mouseupQueue = new Array();
        this.mousedownQueue = new Array();
        this.mousemoveQueue = new Array();
        this.curCoord = [0, 0];
        this.projection = mat4.ortho(mat4.create(), 0.0, SCR_WIDTH, SCR_HEIGHT, 0.0, -1.0, 1.0);
        this.renderObjects = new Array();
        this.originZbuffer = -0.5;
        this.topZbuffer = -1;
    }
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
