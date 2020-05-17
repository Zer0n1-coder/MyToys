import { Material } from "./Material";

//场景对象基类
export class ObjectBase{
    material:Material;

    constructor();
    constructor(m:Material);
    constructor(m?:Material){
        if(m === undefined)
            this.material = new Material();
        else
            this.material = m;
    }

    rayIntersect(origin:number[],direction:number[]){
        return [false, 0,[0,0,0],[0,0,0]];
    }
}