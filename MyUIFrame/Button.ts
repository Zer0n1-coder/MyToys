import { Widget } from "./Widget";

export class Button extends Widget{
    constructor(widget : null|Widget){
        super(widget);
        this.text = "button";
    }

    setText(text :string){
        this.text = text;
    }

    private text : string;
}