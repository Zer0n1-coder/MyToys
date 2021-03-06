import { gl, global } from "./RenderContext";
import { Object_ } from "./Object";
import { vec3, mat4 } from "../gl-matrix-ts/index";
export class Widget extends Object_ {
    constructor(parent) {
        super();
        this.showed = true;
        this.enableSize = true;
        this.enableMove = true;
        this.enableFocusChange = true;
        this.enableTouchChange = false;
        this.enableZbuffer = true;
        this.mouseOn = false;
        //widget状态量
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
        if (parent) {
            parent.children.push(this);
            this.parent = parent;
            this.originCoord = [parent.originCoord[0], parent.originCoord[1]];
            this.zbuffer = parent.zbuffer + 0.001;
        }
        else {
            this.originCoord = [0, 0];
            this.zbuffer = global.originZbuffer;
            global.originZbuffer += 0.01;
        }
        this.color = [1, 1, 1, 1];
        global.renderObjects.push(this);
    }
    static getRootWidget(child) {
        return child.parent ? this.getRootWidget(child.parent) : child;
    }
    static changeAllChildrenDepth(root) {
        let queue = new Array();
        queue.push(root);
        for (;;) {
            let front = queue.shift();
            if (front && front.parent) {
                front.zbuffer = front.parent.zbuffer + 0.001;
                for (let child of front.children) {
                    queue.push(child);
                }
            }
            else if (!front) {
                break;
            }
        }
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
        this.originCoord = orig;
    }
    setColor(color) {
        this.color[0] = color[0];
        this.color[1] = color[1];
        this.color[2] = color[2];
    }
    getParent() {
        return this.parent;
    }
    enableChangeZ() {
        return this.enableZbuffer;
    }
    setMouseOn(b) {
        this.mouseOn = b;
    }
    getZbuffer() {
        return this.zbuffer;
    }
    cutZbuffer() {
        this.zbuffer -= 0.01;
    }
    rendererFrame() {
        this.event();
        this.update();
        this.rendering();
    }
    //前处理
    advance() {
        this.advanceEvent();
    }
    intersect(mousePos) {
        let realCoord = [this.originCoord[0], this.originCoord[1]];
        if (this.parent) {
            realCoord[0] += this.parent.originCoord[0];
            realCoord[1] += this.parent.originCoord[1];
        }
        if (mousePos[0] > realCoord[0] && mousePos[1] > realCoord[1] && mousePos[0] < (realCoord[0] + this.width) && mousePos[1] < (realCoord[1] + this.height))
            return true;
        else
            return false;
    }
    //事件分发以及根据事件改变widget当前状态
    event() {
        if (!this.showed)
            return;
        //响应各种事件
        if (global.mouseupQueue.length > 0) {
            this.mouseReleaseEvent(global.mouseupQueue[0]);
        }
        if (global.mousedownQueue.length > 0) {
            if (this.mouseOn) {
                this.intersectPointed = true;
                this.mousePressEvent(global.mousedownQueue[0]);
            }
            else {
                this.inrangePointed = this.inRange([global.mousedownQueue[0].offsetX, global.mousedownQueue[0].offsetY]);
            }
        }
        if (global.mousemoveQueue.length > 0 && this.mouseOn && !this.inOfRange) {
            this.inOfRange = true;
            this.focusInEvent(global.mousemoveQueue[0]);
        }
        else if (global.mousemoveQueue.length > 0 && !this.mouseOn && this.inOfRange) {
            this.inOfRange = false;
            this.focusOutEvent(global.mousemoveQueue[0]);
        }
    }
    //实现widget反馈效果
    update() {
        if (!this.showed)
            return;
        this.updateEvent();
    }
    //根据当前状态渲染出widget
    rendering() {
        if (!this.showed)
            return;
        //渲染控件
        let model = mat4.create();
        let realCoord = [this.originCoord[0], this.originCoord[1]];
        if (this.parent) {
            realCoord[0] += this.parent.originCoord[0];
            realCoord[1] += this.parent.originCoord[1];
            this.zbuffer = this.parent.zbuffer + 0.001;
        }
        mat4.translate(model, model, vec3.fromValues(realCoord[0], realCoord[1], 0.0));
        mat4.scale(model, model, vec3.fromValues(this.width, this.height, 1.0));
        this.widgetShader.setMat4("model", model, true);
        this.widgetShader.setVec4("color", this.changeColor, true);
        this.widgetShader.setFloat("zbuffer", this.zbuffer, true);
        gl.bindVertexArray(this.VAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        this.lineShader.setMat4("model", model, true);
        this.lineShader.setVec4("color", this.changeColor, true);
        this.lineShader.setFloat("zbuffer", this.zbuffer + 0.0005, true);
        gl.drawArrays(gl.LINE_STRIP, 0, 3);
        gl.drawArrays(gl.LINE_STRIP, 3, 3);
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
            0.0, 0.0, 0.0, 0.0,
            1.0, 0.0, 1.0, 0.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 0.0, 0.0
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
        if (this.intersect(global.curCoord) && this.enableFocusChange && this.mouseOn) {
            this.changeColor[0] -= 0.2;
            this.changeColor[1] -= 0.2;
            this.changeColor[2] -= 0.2;
        }
        if (this.intersectPointed) {
            global.topZbuffer = Widget.getRootWidget(this).zbuffer;
            if (this.enableTouchChange) {
                this.changeColor[0] -= 0.2;
                this.changeColor[1] -= 0.2;
                this.changeColor[2] -= 0.2;
            }
        }
        if (global.mousemoveQueue.length > 0 && this.intersectPointed && this.enableMove) {
            let deltaX = 0;
            let deltaY = 0;
            for (let mousemoveEvent of global.mousemoveQueue) {
                deltaX += mousemoveEvent.movementX;
                deltaY += mousemoveEvent.movementY;
            }
            this.changePos(deltaX, deltaY);
        }
        if (global.mousemoveQueue.length > 0 && this.inrangePointed !== 0 && this.enableSize) {
            if (this.inrangePointed === 1) {
                let tmpHeight = this.height;
                for (let mousemoveEvent of global.mousemoveQueue)
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
                for (let mousemoveEvent of global.mousemoveQueue)
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
                for (let mousemoveEvent of global.mousemoveQueue)
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
                for (let mousemoveEvent of global.mousemoveQueue)
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
    inRange(mousePos) {
        let realCoord = [this.originCoord[0], this.originCoord[1]];
        if (this.parent) {
            realCoord[0] += this.parent.originCoord[0];
            realCoord[1] += this.parent.originCoord[1];
        }
        if (mousePos[0] > realCoord[0] && mousePos[0] < (realCoord[0] + this.width) && mousePos[1] > (realCoord[1] - 10) && mousePos[1] < realCoord[1]) {
            return 1;
        }
        else if (mousePos[0] > (realCoord[0] - 10) && mousePos[0] < realCoord[0] && mousePos[1] > realCoord[1] && mousePos[1] < (realCoord[1] + this.height)) {
            return 2;
        }
        else if (mousePos[0] > realCoord[0] && mousePos[0] < (realCoord[0] + this.width) && mousePos[1] < (realCoord[1] + this.height + 10) && mousePos[1] > (realCoord[1] + this.height)) {
            return 3;
        }
        else if (mousePos[0] < (realCoord[0] + this.width + 10) && mousePos[0] > (realCoord[0] + this.width) && mousePos[1] > realCoord[1] && mousePos[1] < (realCoord[1] + this.height)) {
            return 4;
        }
        else
            return 0;
    }
}
