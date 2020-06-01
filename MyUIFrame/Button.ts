import { Widget } from "./Widget";

export class Button extends Widget{
    constructor(parent : null|Widget){
        super(parent);
        this.text = "button";
        this.enableSize = false;
        this.enableMove = false;
    }

    setText(text :string){
        this.text = text;
    }

    protected frameEvent(){
        super.frameEvent();

        if(this.intersectPointed){
            this.changeColor[3] += 0.2;
        }
    }

    private text : string;
}