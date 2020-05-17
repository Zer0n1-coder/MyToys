import *as Vec3 from "./Vec3";
import { ObjectBase } from "./Object";

//地板对象
export class Board extends ObjectBase{
    heigthPos   : number;
    width       : number;
    length      : number;
    center      : number[];

    constructor(){
        super();
        this.heigthPos = -4;
        this.length = 60;
        this.width = 60;
        this.center = [0,-20];
        this.material.diffuseColor = [0.0, 0.5, 0.0];  
        this.material.diffuseColor =Vec3.multiply( this.material.diffuseColor,0.3);
    }

    //
    rayIntersect(origin:number[],direction:number[]){
        if(Math.abs(direction[1]) > 1e-3){
            let d = -(origin[1] - this.heigthPos) / direction[1]; // “光源”沿着光线方向到平面的距离。
            let pt = Vec3.add(origin,Vec3.multiply(direction,d)); //交点坐标
            if(d > 0 && pt[0] < (this.center[0] + this.length/2) &&pt[0] > (this.center[0] - this.length/2) && pt[2] < (this.center[1] + this.width/2)&&pt[2] > (this.center[1] - this.width/2)){  //限定矩形的大小
                let t0 = d;
                let hit = pt;
                let N = [0,1,0];
                return [true, t0,hit,N];
            }
        }

        return [false, 0,[0,0,0],[0,0,0]];
    }
}