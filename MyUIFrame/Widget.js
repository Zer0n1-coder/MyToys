import { gl, widgetShader, mousemoveQueue, renderObjects, mouseupQueue, mousedownQueue, curCoord } from "./RenderContext";
import { Object_ } from "./Object";
import { vec3, mat4 } from "./gl-matrix-ts/index";
export class Widget extends Object_ {
    constructor(parent) {
        super();
        this.intersectPointed = false;
        this.inrangePointed = 0;
        this.changeColor = [0, 0, 0, 1];
        this.inOfRange = false;
        this.children = new Array();
        this.parent = null;
        this.width = 0;
        this.minWidth = 20;
        this.maxWidth = 500;
        this.minHeight = 20;
        this.maxHeight = 500;
        this.height = 0;
        this.origin = [0, 0];
        this.showed = true;
        this.color = [1.0, 1.0, 1.0, 0.4];
        if (parent) {
            parent.children.push(this);
            this.parent = parent;
        }
        renderObjects.push(this);
    }
    //public:
    show() {
        this.showed = true;
    }
    hide() {
        this.showed = false;
    }
    setWidth(width) {
        this.width = width;
        if (width < this.minWidth)
            this.minWidth = width;
        else if (width > this.maxWidth)
            this.maxWidth = width;
    }
    setHeight(height) {
        this.height = height;
        if (this.height < this.minHeight)
            this.minHeight = height;
        else if (this.height > this.maxHeight)
            this.maxHeight = height;
    }
    setOrigin(origin) {
        this.origin = origin;
    }
    setColor(color) {
        this.color = color;
    }
    //onFirst 和onUpdate 函数都是提供给渲染器调用，不能被重载
    onFirst() {
        this.drawEvent();
    }
    onUpdate() {
        //不显示将不会渲染和响应任何事件，只能通过对象之间的通信来让该对象显示之后响应事件
        if (!this.showed)
            return;
        //响应各种事件
        if (mouseupQueue.length > 0) {
            this.mouseReleaseEvent(mouseupQueue[0]);
        }
        if (mousedownQueue.length > 0) {
            this.mousePressEvent(mousedownQueue[0]);
        }
        if (mousemoveQueue.length > 0 && this.intersect([mousemoveQueue[0].offsetX, mousemoveQueue[0].offsetY]) && !this.inOfRange) {
            this.inOfRange = true;
            this.focusInEvent(mousemoveQueue[0]);
        }
        else if (mousemoveQueue.length > 0 && !this.intersect([mousemoveQueue[0].offsetX, mousemoveQueue[0].offsetY]) && this.inOfRange) {
            this.inOfRange = false;
            this.focusOutEvent(mousemoveQueue[0]);
        }
        this.frameEvent();
        //渲染控件
        let model = mat4.create();
        mat4.translate(model, model, vec3.fromValues(this.origin[0], this.origin[1], 0.0));
        mat4.scale(model, model, vec3.fromValues(this.width, this.height, 1.0));
        widgetShader.setMat4("model", model, true);
        widgetShader.setVec4("color", this.changeColor, true);
        gl.bindVertexArray(this.VAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);
    }
    //protected:
    focusInEvent(ev) {
    }
    focusOutEvent(ev) {
    }
    //渲染前调用一次
    drawEvent() {
        this.drawWidget();
    }
    //每一帧调用
    frameEvent() {
        this.updateFrame();
    }
    mousePressEvent(ev) {
        if (this.intersect([ev.offsetX, ev.offsetY]))
            this.intersectPointed = true;
        else
            this.inrangePointed = this.inRange([ev.offsetX, ev.offsetY]);
    }
    mouseReleaseEvent(ev) {
        this.intersectPointed = false;
        this.inrangePointed = 0;
    }
    //
    drawWidget() {
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
    }
    //private:
    updateFrame() {
        this.changeColor = [this.color[0], this.color[1], this.color[2], this.color[3]];
        if (this.intersect(curCoord)) {
            console.log(curCoord);
            this.changeColor[3] += 0.3;
        }
        if (mousemoveQueue.length > 0 && this.intersectPointed) {
            this.origin[0] += mousemoveQueue[0].movementX;
            this.origin[1] += mousemoveQueue[0].movementY;
        }
        if (mousemoveQueue.length > 0 && this.inrangePointed !== 0) {
            if (this.inrangePointed === 1) {
                let tmpHeight = this.height;
                tmpHeight -= mousemoveQueue[0].movementY;
                if (tmpHeight < this.minHeight) {
                    this.origin[1] += (this.height - this.minHeight);
                    this.height = this.minHeight;
                }
                else if (tmpHeight > this.maxHeight) {
                    this.origin[1] += (this.height - this.maxHeight);
                    this.height = this.maxHeight;
                }
                else {
                    this.origin[1] += mousemoveQueue[0].movementY;
                    this.height = tmpHeight;
                }
            }
            else if (this.inrangePointed === 2) {
                let tmpWidth = this.width;
                tmpWidth -= mousemoveQueue[0].movementX;
                if (tmpWidth < this.minWidth) {
                    this.origin[0] += (this.width - this.minWidth);
                    this.width = this.minWidth;
                }
                else if (tmpWidth > this.maxWidth) {
                    this.origin[0] += (this.width - this.maxWidth);
                    this.width = this.maxWidth;
                }
                else {
                    this.origin[0] += mousemoveQueue[0].movementX;
                    this.width = tmpWidth;
                }
            }
            else if (this.inrangePointed === 3) {
                let tmpHeight = this.height;
                tmpHeight += mousemoveQueue[0].movementY;
                if (tmpHeight < this.minHeight) {
                    this.height = this.minHeight;
                }
                else if (tmpHeight > this.maxHeight) {
                    this.height = this.maxHeight;
                }
                else {
                    this.height = tmpHeight;
                }
            }
            else if (this.inrangePointed === 4) {
                let tmpWidth = this.width;
                tmpWidth += mousemoveQueue[0].movementX;
                if (tmpWidth < this.minWidth) {
                    this.width = this.minWidth;
                }
                else if (tmpWidth > this.maxWidth) {
                    this.width = this.maxWidth;
                }
                else {
                    this.width = tmpWidth;
                }
            }
        }
    }
    intersect(mousePos) {
        if (mousePos[0] > this.origin[0] && mousePos[1] > this.origin[1] && mousePos[0] < (this.origin[0] + this.width) && mousePos[1] < (this.origin[1] + this.height))
            return true;
        else
            return false;
    }
    inRange(mousePos) {
        if (mousePos[0] > this.origin[0] && mousePos[0] < (this.origin[0] + this.width) && mousePos[1] > (this.origin[1] - 10) && mousePos[1] < this.origin[1]) {
            return 1;
        }
        else if (mousePos[0] > (this.origin[0] - 10) && mousePos[0] < this.origin[0] && mousePos[1] > this.origin[1] && mousePos[1] < (this.origin[1] + this.height)) {
            return 2;
        }
        else if (mousePos[0] > this.origin[0] && mousePos[0] < (this.origin[0] + this.width) && mousePos[1] < (this.origin[1] + this.height + 10) && mousePos[1] > (this.origin[1] + this.height)) {
            return 3;
        }
        else if (mousePos[0] < (this.origin[0] + this.width + 10) && mousePos[0] > (this.origin[0] + this.width) && mousePos[1] > this.origin[1] && mousePos[1] < (this.origin[1] + this.height)) {
            return 4;
        }
        else
            return 0;
    }
}
