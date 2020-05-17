import * as Vec3 from "./Vec3"

//求反射光线方向
export function reflect(I:number[],N:number[]){
    return Vec3.minus(I,Vec3.multiply(Vec3.multiply(N,2),Vec3.dot(I,N)));
}

//求折射光线方向
export function refract(I:number[],N:number[],etat:number,etai = 1){
    let cosi = - Math.max(-1,Math.min(1,Vec3.dot(I,N)));
    if(cosi < 0){
        refract(I,Vec3.negate(N),etai,etat);
    }
    let eta = etai / etat;
    let k = 1 - eta*eta*(1 - cosi*cosi);
    return k < 0? [1,0,0] : Vec3.add(Vec3.multiply(I,eta),Vec3.multiply(N,eta*cosi - Math.sqrt(k))); 
}