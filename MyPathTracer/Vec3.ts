//三维向量（顶点）的基本运算

export function dot(a:number[],b:number[]){
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

export function add(a:number[],b:number[]){
    return [a[0] + b[0],a[1] + b[1] , a[2] + b[2]];
}

export function normalize(a:number[]){
    let length = Math.sqrt(a[0]*a[0] + a[1] * a[1] + a[2] *a[2]);
    let bLength = 1 / length;
    return [a[0]*bLength,a[1]*bLength,a[2]*bLength];
}

export function minus(a:number[],b:number[]){
    return [a[0] - b[0],a[1] - b[1],a[2] - b[2]];
}

export function multiply(a:number[],b:number[]):number[];
export function multiply(a:number[],b:number):number[];
export function multiply(a:number[],b:number[] | number):number[]{
    if(typeof b === "number")
        return [a[0] *b,a[1] *b,a[2]*b];
    else
        return [a[0]*b[0],a[1]*b[1],a[2]*b[2]];
}


export function negate(a:number[]):number[]{
    return [-a[0],-a[1],-a[2]];
}

export function length(a:number[]){
    return Math.hypot(a[0],a[1],a[2]);
}

export function cross(a:number[],b:number[]){
    return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
}