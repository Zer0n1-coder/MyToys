import { Widget } from "./Widget";

export class Window_ extends Widget{
    constructor(parent : null | Widget){
        super(parent);
        
        this.enableFocusChange = false;
    }
}