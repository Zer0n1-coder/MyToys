import { MaterialTypes } from "./Materials";
import { Ray } from "./Ray";
import * as Vec3 from "./Vec3";

export class Sphere{
    rad:number;     //radius
    p:number[];     //position
    e:number[];     //emission
    c:number[];     //color
    m:MaterialTypes;

    constructor(rad:number,p:number[],e:number[],c:number[],m:MaterialTypes){
        this.rad = rad;
        this.p = p;
        this.e = e;
        this.c = c;
        this.m = m;
    }

    intersect(r:Ray):number{
        let op = Vec3.minus(this.p,r.o);
        let t :number;
        let eps = 1e-4;
        let b = Vec3.dot(op,r.d);
        let det = b * b - Vec3.dot(op,op) + this.rad*this.rad;
        if(det < 0)
            return 0;
        else
            det = Math.sqrt(det);

        return (t = b - det) > eps?t : ((t = b +det) > eps?t:0);
    }
}