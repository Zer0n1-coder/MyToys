import { Window_ } from "./Window";
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

    let window = new Window_(null);
    window.setWidth(500);
    window.setHeight(500);
    window.setOrigin([200,200]);
    window.show();

    let button = new Button(window);
    button.setWidth(100);
    button.setHeight(50);
    button.setColor([0.9,0.9,0.9]);
    button.show();

    let button1 = new Button(null);
    button1.setWidth(100);
    button1.setHeight(50);
    button1.setOrigin([0,100]);
    button1.show();

    Renderer.render();
}