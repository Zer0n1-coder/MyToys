import { gl, SCR_WIDTH, SCR_HEIGHT, canvas, widgetShader, mousedownQueue, mousemoveQueue, projection, mouseupQueue, desktopShader, desktopTexture, renderObjects, curCoord, maxZbuffer } from "./RenderContext";
import { mousedown, mouseup, mousemove } from "./EventHandle";
import { mat4, vec3 } from "./gl-matrix-ts/index";
export class Renderer {
    static init() {
        canvas.addEventListener("mousedown", mousedown);
        canvas.addEventListener("mouseup", mouseup);
        canvas.addEventListener("mousemove", mousemove);
        canvas.setAttribute('tabindex', '0'); // 让canvas获取焦点从而响应事件
        canvas.addEventListener('click', function () {
            canvas.focus();
        });
        let VBO = gl.createBuffer();
        let vertices = new Float32Array([
            // 位置     // 纹理
            0.0, 1.0, 0.0, 1.0,
            1.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 0.0
        ]);
        let tmpVAO = gl.createVertexArray();
        if (tmpVAO === null) {
            alert("unable to create VAO!");
            return;
        }
        this.VAO = tmpVAO;
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindVertexArray(this.VAO);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
        desktopShader.use();
        desktopShader.setInt("desktop", 0);
        desktopShader.setMat4("projection", projection);
    }
    static drawDesktop() {
        let model = mat4.create();
        mat4.translate(model, model, vec3.fromValues(0, 0, 0.0));
        mat4.scale(model, model, vec3.fromValues(SCR_WIDTH, SCR_HEIGHT, 1.0));
        desktopShader.setMat4("model", model, true);
        gl.activeTexture(gl.TEXTURE0);
        desktopTexture.bind();
        gl.bindVertexArray(this.VAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);
    }
    static render() {
        Renderer.init();
        gl.viewport(0, 0, SCR_WIDTH, SCR_HEIGHT);
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.BLEND);
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        widgetShader.use();
        widgetShader.setMat4("projection", projection);
        for (let widget of renderObjects)
            widget.advance();
        function frame() {
            //let currentFrame = (new Date).getTime() / 1000;
            //deltaTime = currentFrame - lastFrame;
            //lastFrame = currentFrame;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            Renderer.drawDesktop();
            let highest = null;
            for (let widget of renderObjects) {
                widget.setMouseOn(false);
                if (widget.intersect(curCoord)) {
                    if (highest === null || highest.getZbuffer() < widget.getZbuffer())
                        highest = widget;
                }
            }
            highest?.setMouseOn(true);
            for (let widget of renderObjects) {
                if (!widget.getParent() && widget.getTop()) {
                    widget.setZ(maxZbuffer + 0.001);
                }
            }
            for (let widget of renderObjects) {
                widget.event();
            }
            for (let widget of renderObjects) {
                widget.update();
            }
            for (let widget of renderObjects) {
                widget.rendering();
            }
            mouseupQueue.length = 0;
            mousedownQueue.length = 0;
            mousemoveQueue.length = 0;
            mousemoveQueue.length = 0;
            requestAnimationFrame(frame);
        }
        frame();
    }
}
