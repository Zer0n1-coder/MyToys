
//材质对象
export class Material{
    refractiveIndex:number;
    diffuseColor:number[];
    albedo:number[];
    specularExponent : number;

    constructor();
    constructor(r:number,a:number[],color:number[],spec:number);
    constructor(r?:number,a?:number[],color?:number[],spec?:number){
        if(color !== undefined && a !== undefined && spec !== undefined && r !== undefined){
            this.diffuseColor = color;
            this.albedo = a;
            this.specularExponent = spec;
            this.refractiveIndex = r;
        }
        else{
            this.diffuseColor = [0,0,0];
            this.albedo = [1,0,0,0];
            this.specularExponent = 0;
            this.refractiveIndex = 1;
        }
    }
}