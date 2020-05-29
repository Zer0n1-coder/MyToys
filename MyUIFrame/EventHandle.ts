import {  mousedownQueue, mouseupQueue,mousemoveQueue, curCoord } from "./RenderContext";

export function mousedown(ev :MouseEvent){
    mousedownQueue.push(ev);
}

export function mouseup(ev :MouseEvent){
    mouseupQueue.push(ev);
}

export function mousemove(ev:MouseEvent){
    curCoord[0] = ev.offsetX;
    curCoord[1] = ev.offsetY;
    mousemoveQueue.push(ev);
}