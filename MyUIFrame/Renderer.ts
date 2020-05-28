import { Widget } from "./Widget";
import {gl,SCR_WIDTH,SCR_HEIGHT,canvas, globalShader, mousedownQueue,mousemoveQueue, projection, mouseupQueue} from "./RenderContext";
import { mousedown, mouseup, mousemove } from "./EventHandle";

export class Renderer{
    static init(){
        canvas.addEventListener("mousedown", mousedown);
        canvas.addEventListener("mouseup", mouseup);
        canvas.addEventListener("mousemove", mousemove);

        canvas.setAttribute('tabindex', '0'); // 让canvas获取焦点从而响应事件
        canvas.addEventListener('click', function () {
            canvas.focus();
        });
    }

    static render(widget:Widget){
        Renderer.init();

        gl.viewport(0, 0, SCR_WIDTH, SCR_HEIGHT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
        
        globalShader.use();
        globalShader.setMat4("projection", projection);

        widget.onDraw();

        function frame() {
            //let currentFrame = (new Date).getTime() / 1000;
            //deltaTime = currentFrame - lastFrame;
            //lastFrame = currentFrame;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

            if(mouseupQueue.length >0){
                widget.mouseReleaseEvent(mouseupQueue[0]);
                mouseupQueue.length = 0;
            }
                
            if(mousedownQueue.length > 0){
                widget.mousePressEvent(mousedownQueue[0]);
                mousedownQueue.length = 0;
            }
            widget.onUpdate();
            mousemoveQueue.length = 0;

            requestAnimationFrame(frame);
        }

        frame();
    }
}