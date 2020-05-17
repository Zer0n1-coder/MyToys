import * as Vec3 from "./Vec3";
import { Material } from "./Material";
import {ObjectBase} from "./Object";

//球对象
export class Sphere extends ObjectBase{
    center:number[];
    radius:number;

    constructor(c : number[],r:number,m:Material){
        super();
        this.center = c;
        this.radius = r;
        this.material = m;
    }

    //光线与球求交判断
    rayIntersect(origin:number[],direction:number[]){
        let L = [this.center[0] - origin[0],this.center[1] - origin[1],this.center[2] - origin[2]];
        let tca = Vec3.dot(L,direction);
        let d2 = Vec3.dot(L,L) - tca*tca; 

        if(d2 > this.radius*this.radius) 
            return [false,0,[0,0,0],[0,0,0]];

        let thc = Math.sqrt(this.radius*this.radius -d2);
        let t0 = tca -thc;
        let t1 = tca + thc;

        if(t0 < 0) {
            t0 = t1;
            return [false, t0,[0,0,0],[0,0,0]];
        }

        let hit =Vec3.add(origin,Vec3.multiply(direction,t0));
        let N = Vec3.normalize((Vec3.minus(hit,this.center)));

        return [true, t0,hit,N];
    }
}