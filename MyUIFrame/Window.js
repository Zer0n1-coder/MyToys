import { Widget } from "./Widget";
export class Window_ extends Widget {
    constructor(parent) {
        super(parent);
        this.enableFocusChange = false;
    }
}
