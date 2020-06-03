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
    updateEvent() {
        super.updateEvent();
        if (this.intersectPointed) {
            this.changeColor[0] -= 0.2;
            this.changeColor[1] -= 0.2;
            this.changeColor[2] -= 0.2;
        }
    }
    oneSlot(num) {
        alert("hello world!" + num);
    }
}
