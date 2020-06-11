import { Widget } from "./core/Widget";
export class Button extends Widget {
    constructor(parent) {
        super(parent);
        this.text = "button";
        this.enableSize = false;
        this.enableMove = false;
        this.enableTouchChange = true;
    }
    setText(text) {
        this.text = text;
    }
    oneSlot(num) {
        alert("hello world!" + num);
    }
}
