import { Widget } from "./Widget";


export function test(){
    let widget = new Widget();
    widget.setWidth(400);
    widget.setHeight(400);
    widget.setOrigin([100,100]);
    widget.show();
}