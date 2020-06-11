import { Widget } from "./core/Widget";

export class Button extends Widget{
    constructor(parent : null|Widget){
        super(parent);
        this.text = "button";
        this.enableSize = false;
        this.enableMove = false;
        this.enableTouchChange = true;
    }

    setText(text :string){
        this.text = text;
    }

    oneSlot(num:number){
        alert("hello world!" + num);
    }

    private text : string;
}