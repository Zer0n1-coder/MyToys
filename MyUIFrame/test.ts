import { Widget } from "./Widget";


export function test(){
    let widget = new Widget();
    widget.setWidth(200);
    widget.setHeight(200);
    widget.setOrigin([200,200]);
    widget.show();
}