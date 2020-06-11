import { Window_ } from "./Window";
import { Renderer } from "./core/Renderer";
import { TaskBar } from "./TaskBar";
import { SCR_HEIGHT, SCR_WIDTH, canvas } from "./core/RenderContext";
import { Dialog } from "./Dialog";

export function test(){

    let taskBar = new TaskBar(null);
    taskBar.setOrigin([0,SCR_HEIGHT - 50]);
    taskBar.setWidth(SCR_WIDTH);
    taskBar.setHeight(50);
    taskBar.show();

    let window_ = new Window_(null);
    window_.setWidth(500);
    window_.setHeight(500);
    window_.setOrigin([200,200]);
    window_.show();

    let dialog = new Dialog(null);
    dialog.show();

    Renderer.render();
}