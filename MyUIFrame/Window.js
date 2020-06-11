import { Widget } from "./core/Widget";
import { Button } from "./Button";
export class Window_ extends Widget {
    constructor(parent) {
        super(parent);
        this.enableFocusChange = false;
        this.button = new Button(this);
        this.button.setWidth(100);
        this.button.setHeight(50);
        this.button.setColor([0.9, 0.9, 0.9]);
        this.button.show();
    }
    oneSign(num) {
        this.callFunc("oneSign", [num]);
    }
    focusInEvent(ev) {
        this.oneSign(12);
    }
}
