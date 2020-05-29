import { Widget } from "./Widget";
export class Button extends Widget {
    constructor(widget) {
        super(widget);
        this.text = "button";
    }
    setText(text) {
        this.text = text;
    }
}
