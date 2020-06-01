import { Widget } from "./Widget";
export class Button extends Widget {
    constructor(parent) {
        super(parent);
        this.text = "button";
        this.enableSize = false;
        this.enableMove = false;
    }
    setText(text) {
        this.text = text;
    }
    frameEvent() {
        super.frameEvent();
        if (this.intersectPointed) {
            this.changeColor[3] += 0.2;
        }
    }
}
