import {  global } from "./RenderContext";

export function mousedown(ev :MouseEvent){
    global.mousedownQueue.push(ev);
}

export function mouseup(ev :MouseEvent){
    global.mouseupQueue.push(ev);
}

export function mousemove(ev:MouseEvent){
    global.curCoord[0] = ev.offsetX;
    global.curCoord[1] = ev.offsetY;
    global.mousemoveQueue.push(ev);
}