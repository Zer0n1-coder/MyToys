import { ObjectBase } from "./Object";
import *as Vec3 from "./Vec3";

//墙对象
export class Wall extends ObjectBase{
    pos : number;
    height : number;
    width:number;
    center:number[];

    constructor(){
        super();
        this.pos = -6;
        this.height = 40;
        this.width = 40;
        this.center = [10,-20];
        this.material.diffuseColor = [0.5, 0.0, 0.0];  
        this.material.diffuseColor =Vec3.multiply( this.material.diffuseColor,0.3);
    }

    rayIntersect(origin:number[],direction:number[]){
        if(Math.abs(direction[0]) > 1e-3){
            let d = -(origin[0] - this.pos) / direction[0]; // “光源”沿着光线方向到平面的距离。
            let pt = Vec3.add(origin,Vec3.multiply(direction,d)); //交点坐标
            if(d > 0 && pt[1] < (this.center[0] + this.height/2) &&pt[1] > (this.center[0] - this.height/2) && pt[2] < (this.center[1] + this.width/2)&&pt[2] > (this.center[1] - this.width/2)){  //限定矩形的大小
                let t0 = d;
                let hit = pt;
                let N = [1,0,0];
                return [true, t0,hit,N];
            }
        }

        return [false, 0,[0,0,0],[0,0,0]];
    }
}