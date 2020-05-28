import { mousedownQueue, mouseupQueue, mousemoveQueue } from "./RenderContext";
export function mousedown(ev) {
    mousedownQueue.push(ev);
}
export function mouseup(ev) {
    mouseupQueue.push(ev);
}
export function mousemove(ev) {
    mousemoveQueue.push(ev);
}
