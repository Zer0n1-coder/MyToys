import { gl, widgetShader, mousemoveQueue, renderObjects, mouseupQueue, mousedownQueue, curCoord } from "./RenderContext";
import { Object_ } from "./Object";
import { vec3, mat4 } from "./gl-matrix-ts/index";
export class Widget extends Object_ {
    constructor(parent) {
        super();
        this.showed = true;
        this.intersectPointed = false;
        this.inrangePointed = 0;
        this.changeColor = [0, 0, 0, 1];
        this.inOfRange = false;
        this.enableSize = true;
        this.enableMove = true;
        this.zbuffer = -0.5;
        this.enableFocusChange = true;
        this.children = new Array();
        this.parent = null;
        this.width = 0;
        this.minWidth = 20;
        this.maxWidth = 500;
        this.minHeight = 20;
        this.maxHeight = 500;
        this.height = 0;
        if (parent) {
            parent.children.push(this);
            this.parent = parent;
            this.originCoord = [parent.originCoord[0], parent.originCoord[1]];
            this.zbuffer = parent.zbuffer + 0.001;
        }
        else
            this.originCoord = [0, 0];
        this.color = [1, 1, 1, 1];
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
    setZ(z) {
        this.zbuffer = z;
    }
    setHeight(height) {
        this.height = height;
        if (this.height < this.minHeight)
            this.minHeight = height;
        else if (this.height > this.maxHeight)
            this.maxHeight = height;
    }
    setOrigin(orig) {
        if (this.parent)
            this.originCoord = [orig[0] + this.originCoord[0], orig[1] + this.originCoord[1]];
        else
            this.originCoord = orig;
    }
    setColor(color) {
        this.color[0] = color[0];
        this.color[1] = color[1];
        this.color[2] = color[2];
    }
    getZbuffer() {
        return this.zbuffer;
    }
    //onFirst 和onUpdate 函数都是提供给渲染器调用，不要重载
    advance() {
        this.advanceEvent();
    }
    event() {
        if (!this.showed)
            return;
        //响应各种事件
        if (mouseupQueue.length > 0) {
            this.mouseReleaseEvent(mouseupQueue[0]);
        }
        if (mousedownQueue.length > 0) {
            if (this.intersect([mousedownQueue[0].offsetX, mousedownQueue[0].offsetY])) {
                this.intersectPointed = true;
                this.mousePressEvent(mousedownQueue[0]);
            }
            else {
                this.inrangePointed = this.inRange([mousedownQueue[0].offsetX, mousedownQueue[0].offsetY]);
            }
        }
        if (mousemoveQueue.length > 0 && this.intersect([mousemoveQueue[0].offsetX, mousemoveQueue[0].offsetY]) && !this.inOfRange) {
            this.inOfRange = true;
            this.focusInEvent(mousemoveQueue[0]);
        }
        else if (mousemoveQueue.length > 0 && !this.intersect([mousemoveQueue[0].offsetX, mousemoveQueue[0].offsetY]) && this.inOfRange) {
            this.inOfRange = false;
            this.focusOutEvent(mousemoveQueue[0]);
        }
    }
    update() {
        if (!this.showed)
            return;
        this.updateEvent();
    }
    rendering() {
        if (!this.showed)
            return;
        //渲染控件
        let model = mat4.create();
        mat4.translate(model, model, vec3.fromValues(this.originCoord[0], this.originCoord[1], 0.0));
        mat4.scale(model, model, vec3.fromValues(this.width, this.height, 1.0));
        widgetShader.setMat4("model", model, true);
        widgetShader.setVec4("color", this.changeColor, true);
        widgetShader.setFloat("zbuffer", this.zbuffer, true);
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
    advanceEvent() {
        this.drawWidget();
    }
    //每一帧调用
    updateEvent() {
        this.updateFrame();
    }
    mousePressEvent(ev) {
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
        if (this.intersect(curCoord) && this.enableFocusChange) {
            this.changeColor[0] -= 0.2;
            this.changeColor[1] -= 0.2;
            this.changeColor[2] -= 0.2;
        }
        if (mousemoveQueue.length > 0 && this.intersectPointed && this.enableMove) {
            let deltaX = 0;
            let deltaY = 0;
            for (let mousemoveEvent of mousemoveQueue) {
                deltaX += mousemoveEvent.movementX;
                deltaY += mousemoveEvent.movementY;
            }
            this.changePos(deltaX, deltaY);
            for (let child of this.children)
                child.changePos(deltaX, deltaY);
        }
        if (mousemoveQueue.length > 0 && this.inrangePointed !== 0 && this.enableSize) {
            if (this.inrangePointed === 1) {
                let tmpHeight = this.height;
                for (let mousemoveEvent of mousemoveQueue)
                    tmpHeight -= mousemoveEvent.movementY;
                if (tmpHeight < this.minHeight) {
                    this.originCoord[1] += (this.height - this.minHeight);
                    this.height = this.minHeight;
                }
                else if (tmpHeight > this.maxHeight) {
                    this.originCoord[1] += (this.height - this.maxHeight);
                    this.height = this.maxHeight;
                }
                else {
                    this.originCoord[1] += (this.height - tmpHeight);
                    this.height = tmpHeight;
                }
            }
            else if (this.inrangePointed === 2) {
                let tmpWidth = this.width;
                for (let mousemoveEvent of mousemoveQueue)
                    tmpWidth -= mousemoveEvent.movementX;
                if (tmpWidth < this.minWidth) {
                    this.originCoord[0] += (this.width - this.minWidth);
                    this.width = this.minWidth;
                }
                else if (tmpWidth > this.maxWidth) {
                    this.originCoord[0] += (this.width - this.maxWidth);
                    this.width = this.maxWidth;
                }
                else {
                    this.originCoord[0] += (this.width - tmpWidth);
                    this.width = tmpWidth;
                }
            }
            else if (this.inrangePointed === 3) {
                let tmpHeight = this.height;
                for (let mousemoveEvent of mousemoveQueue)
                    tmpHeight += mousemoveEvent.movementY;
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
                for (let mousemoveEvent of mousemoveQueue)
                    tmpWidth += mousemoveEvent.movementX;
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
    changePos(deltaX, deltaY) {
        this.originCoord[0] += deltaX;
        this.originCoord[1] += deltaY;
    }
    intersect(mousePos) {
        if (mousePos[0] > this.originCoord[0] && mousePos[1] > this.originCoord[1] && mousePos[0] < (this.originCoord[0] + this.width) && mousePos[1] < (this.originCoord[1] + this.height))
            return true;
        else
            return false;
    }
    inRange(mousePos) {
        if (mousePos[0] > this.originCoord[0] && mousePos[0] < (this.originCoord[0] + this.width) && mousePos[1] > (this.originCoord[1] - 10) && mousePos[1] < this.originCoord[1]) {
            return 1;
        }
        else if (mousePos[0] > (this.originCoord[0] - 10) && mousePos[0] < this.originCoord[0] && mousePos[1] > this.originCoord[1] && mousePos[1] < (this.originCoord[1] + this.height)) {
            return 2;
        }
        else if (mousePos[0] > this.originCoord[0] && mousePos[0] < (this.originCoord[0] + this.width) && mousePos[1] < (this.originCoord[1] + this.height + 10) && mousePos[1] > (this.originCoord[1] + this.height)) {
            return 3;
        }
        else if (mousePos[0] < (this.originCoord[0] + this.width + 10) && mousePos[0] > (this.originCoord[0] + this.width) && mousePos[1] > this.originCoord[1] && mousePos[1] < (this.originCoord[1] + this.height)) {
            return 4;
        }
        else
            return 0;
    }
}
