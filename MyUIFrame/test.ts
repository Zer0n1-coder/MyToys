import { Widget } from "./Widget";
import { Renderer } from "./Renderer";
import { Button } from "./Button";
import { TaskBar } from "./TaskBar";
import { SCR_HEIGHT, SCR_WIDTH } from "./RenderContext";


export function test(){

    let taskBar = new TaskBar(null);
    taskBar.setOrigin([0,SCR_HEIGHT - 50]);
    taskBar.setWidth(SCR_WIDTH);
    taskBar.setHeight(50);
    taskBar.show();

    let widget = new Widget(null);
    widget.setWidth(500);
    widget.setHeight(500);
    widget.setOrigin([200,200]);
    widget.show();

    let button = new Button(widget);
    button.setWidth(100);
    button.setHeight(50);
    button.setZ(0.2);
    button.show();

    Renderer.render();
}