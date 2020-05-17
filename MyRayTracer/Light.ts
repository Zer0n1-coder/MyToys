//光源对象
export class Light{
    position:number[];
    intensity:number;

    constructor(p:number[],i:number){
        this.position = p;
        this.intensity = i;
    }
}