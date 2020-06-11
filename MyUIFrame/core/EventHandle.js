import { global } from "./RenderContext";
export function mousedown(ev) {
    global.mousedownQueue.push(ev);
}
export function mouseup(ev) {
    global.mouseupQueue.push(ev);
}
export function mousemove(ev) {
    global.curCoord[0] = ev.offsetX;
    global.curCoord[1] = ev.offsetY;
    global.mousemoveQueue.push(ev);
}
