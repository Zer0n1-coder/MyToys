import { Window_ } from "./Window";
import { Renderer } from "./Renderer";
import { TaskBar } from "./TaskBar";
import { SCR_HEIGHT, SCR_WIDTH } from "./RenderContext";
import { Dialog } from "./Dialog";

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

    let dialog = new Dialog(null);
    dialog.show();

    Renderer.render();
}