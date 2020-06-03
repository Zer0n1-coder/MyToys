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

    protected updateEvent(){
        super.updateEvent();

        if(this.intersectPointed){
            this.changeColor[0] -= 0.2;
            this.changeColor[1] -= 0.2;
            this.changeColor[2] -= 0.2;
        }
    }

    oneSlot(num:number){
        alert("hello world!" + num);
    }

    private text : string;
}