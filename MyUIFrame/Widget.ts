import { Renderer } from "./Renderer";
import { gl, globalShader, mousemoveQueue } from "./RenderContext";
import { Object_ } from "./Object";
import { vec3, mat4 } from "./gl-matrix-ts/index";

export class Widget extends Object_{
    constructor(){
        super();
        this.children = new Array<Widget>();
        this.parent = null;
        this.width = 0;
        this.height = 0;
        this.origin = [0,0];
        this.showed = true;
    }

    show(){
        Renderer.render(this);
    }
    hide(){
        this.showed = false;
    }

    setWidth(width:number){
        this.width = width;
    }
    setHeight(height:number){
        this.height = height;
    }
    setOrigin(origin:number[]){
        this.origin = origin;
    }

    //只会调用一次
    onDraw(){
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
        if(tmpVAO === null){
            alert("unable to create VAO!")
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

    //每一帧都会调用
    onUpdate(){
        if(!this.showed)
            return;

        let model = mat4.create();
        if(mousemoveQueue.length > 0&& this.pointed){
            this.origin[0] += mousemoveQueue[0].movementX;
            this.origin[1] += mousemoveQueue[0].movementY;
        }

        mat4.translate(model, model, vec3.fromValues(this.origin[0], this.origin[1], 0.0));

        mat4.scale(model, model, vec3.fromValues(this.width, this.height, 1.0));

        globalShader.setMat4("model", model);
        //globalShader.setVec3("spriteColor", color);

        gl.bindVertexArray(this.VAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);
    }
    mousePressEvent(ev:MouseEvent){
        if(this.intersect([ev.offsetX,ev.offsetY]))
            this.pointed = true;
    }
    mouseReleaseEvent(ev:MouseEvent){
        this.pointed = false;
    }
    intersect(mousePos:number[]){
        if(mousePos[0] > this.origin[0] && mousePos[1] > this.origin[1] &&mousePos[0] < (this.origin[0] + this.width)&&mousePos[1] < (this.origin[1] + this.height))
            return true;
        else
            return false;
    }

    private children : Widget[];
    private parent : Widget | null;
    private width : number;
    private height : number;
    private origin : number[];
    private showed : boolean;
    private pointed = false;
}