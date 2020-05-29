import { mousedownQueue, mouseupQueue, mousemoveQueue, curCoord } from "./RenderContext";
export function mousedown(ev) {
    mousedownQueue.push(ev);
}
export function mouseup(ev) {
    mouseupQueue.push(ev);
}
export function mousemove(ev) {
    curCoord[0] = ev.offsetX;
    curCoord[1] = ev.offsetY;
    mousemoveQueue.push(ev);
}
