import { Widget } from "./Widget";

export class TaskBar extends Widget{
    constructor(parent:null|Widget){
        super(parent);
        this.enableSize = false;
        this.enableMove = false;
        this.enableFocusChange = false;
        this.color = [0,0,0,0.8];
        this.zbuffer = 0.999;
    }
}