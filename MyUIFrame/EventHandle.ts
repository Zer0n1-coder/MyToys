import {  mousedownQueue, mouseupQueue,mousemoveQueue } from "./RenderContext";

export function mousedown(ev :MouseEvent){
    mousedownQueue.push(ev);
}

export function mouseup(ev :MouseEvent){
    mouseupQueue.push(ev);
}

export function mousemove(ev:MouseEvent){
    mousemoveQueue.push(ev);
}