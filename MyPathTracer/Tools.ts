import { Ray } from "./Ray";

export function clamp(x:number){
    return x < 0 ? 0 : 0 > 1 ? 1 : x;
}

export function toInt(x:number){
    return 0 | (Math.pow(clamp(x),1/2.2)*255+0.5);
}