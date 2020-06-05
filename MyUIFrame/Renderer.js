import { gl, SCR_WIDTH, SCR_HEIGHT, canvas, mousedownQueue, mousemoveQueue, projection, mouseupQueue, renderObjects, curCoord, topZbuffer, originZbuffer, resetTopbuffer } from "./RenderContext";
import { mousedown, mouseup, mousemove } from "./EventHandle";
import { mat4, vec3 } from "./gl-matrix-ts/index";
import { Shader } from "./Shader";
import { loadTextureFromFile } from "./Tools";
import { Widget } from "./Widget";
export class Renderer {
    static render() {
        this.init();
        gl.viewport(0, 0, SCR_WIDTH, SCR_HEIGHT);
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.BLEND);
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        for (let widget of renderObjects) {
            widget.lineShader.setMat4("projection", projection, true);
            widget.widgetShader.setMat4("projection", projection, true);
        }
        for (let widget of renderObjects)
            widget.advance();
        function frame() {
            //let currentFrame = (new Date).getTime() / 1000;
            //deltaTime = currentFrame - lastFrame;
            //lastFrame = currentFrame;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            Renderer.drawDesktop();
            Renderer.handleWidgetUnderMouse();
            for (let widget of renderObjects) {
                let tmpParent = widget.getParent();
                if (!widget.enableChangeZ() || tmpParent)
                    continue;
                if (topZbuffer !== -1 && widget.getZbuffer() > topZbuffer) {
                    widget.cutZbuffer();
                }
                else if ((topZbuffer - 0.001) < widget.getZbuffer() && (topZbuffer + 0.001) > widget.getZbuffer()) {
                    widget.setZ(originZbuffer - 0.01);
                }
                Widget.changeAllChildrenDepth(widget);
            }
            resetTopbuffer();
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
    static init() {
        this.initEvent();
        this.initDesktop();
    }
    static initEvent() {
        canvas.addEventListener("mousedown", mousedown);
        canvas.addEventListener("mouseup", mouseup);
        canvas.addEventListener("mousemove", mousemove);
        canvas.setAttribute('tabindex', '0'); // 让canvas获取焦点从而响应事件
        canvas.addEventListener('click', function () {
            canvas.focus();
        });
    }
    static initDesktop() {
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
        this.desktopShader.use();
        this.desktopShader.setInt("desktop", 0);
        this.desktopShader.setMat4("projection", projection);
    }
    static handleWidgetUnderMouse() {
        let highest = null;
        for (let widget of renderObjects) {
            widget.setMouseOn(false);
            if (widget.intersect(curCoord)) {
                if (highest === null || highest.getZbuffer() < widget.getZbuffer())
                    highest = widget;
            }
        }
        highest?.setMouseOn(true);
    }
    static drawDesktop() {
        let model = mat4.create();
        mat4.translate(model, model, vec3.fromValues(0, 0, 0.0));
        mat4.scale(model, model, vec3.fromValues(SCR_WIDTH, SCR_HEIGHT, 1.0));
        this.desktopShader.setMat4("model", model, true);
        gl.activeTexture(gl.TEXTURE0);
        this.desktopTexture.bind();
        gl.bindVertexArray(this.VAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);
    }
}
Renderer.desktopShader = new Shader("./res/desktop.vs", "./res/desktop.frag");
Renderer.desktopTexture = loadTextureFromFile("background", false);
