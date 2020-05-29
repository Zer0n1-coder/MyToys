import { Widget } from "./Widget";
import { Renderer } from "./Renderer";


export function test(){
    let widget = new Widget(null);
    widget.setWidth(200);
    widget.setHeight(200);
    widget.setOrigin([200,200]);
    widget.show();
    Renderer.render();
}