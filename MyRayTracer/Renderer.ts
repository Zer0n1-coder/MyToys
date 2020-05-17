import * as fs  from "fs";
import * as Vec3 from "./Vec3";
import { Light } from "./Light";
import { Material } from "./Material";
import {reflect,refract} from "./RayAlgorithm";
import { Board } from "./Board";
import { ObjectBase } from "./Object";

export class RayTracerRenderer{
    width       :number;          
    height      :number;
    fov         :number;
    viewPos     :number[];  //相机位置

    maxDepth    :number;    //计算递归最大层数

    lights      :Light[];   //光源

    //场景中的对象
    objects     :ObjectBase[];  //物体
    board       :Board;

    path        :string;    //写入图片的位置

    constructor(){
        this.width = 1024;
        this.height = 768;
        this.fov = Math.PI /3;
        this.maxDepth = 4;
        this.lights = new Array<Light>();
        this.objects = new Array<ObjectBase>();
        this.path = './out.ppm';
        this.viewPos = [0,0,0];
        this.board = new Board();
    }

    render(){
        let data = 'P3\n' + this.width.toString() + ' ' + this.height.toString() + '\n255\n';

        //遍历输出图像的每一个像素点
        for(let j = 0 ; j < this.height;++j){
            for(let i = 0;i < this.width;++i){
                //从相机射向每个像素点的光线方向
                let x =  2*((i + 0.5)/this.width  - 0.5)*Math.tan(this.fov/2)*this.width/this.height;
                let y = -2*((j + 0.5)/this.height - 0.5)*Math.tan(this.fov/2);
                let dir = Vec3.normalize([x, y, -1]);
    
                //计算每个像素点的颜色
                let color = this.castRay(this.viewPos,dir);
    
                let max = Math.max(color[0],Math.max(color[1],color[2]));
                if(max > 1) color =  Vec3.multiply(color,1 /max);
    
                let num = (color[0] * 255) | 0;
                data +=  num.toString() + ' ';
    
                num = (color[1] * 255) | 0;
                data +=  num.toString()+ ' ';
    
                num = (color[2] * 255) | 0;
                data +=  num.toString()+'\n';
            }
        }
    
        fs.writeFile(this.path,data,function(err: NodeJS.ErrnoException|null){
            if(err)
                console.log('writing file is failed!');
        });
    }

    //计算与场景中所有物体的最近交点，需要在场景中添加对象扩展该函数即可（引出实时碰撞检测技术）
    private sceneIntersect(origin:number[],direction : number[]){
        let dist = Number.MAX_VALUE;
    
        let hit = [0,0,0];
        let N = [0,0,0];
        let material =new Material;
    
        //计算与球体的最近交点
        for(let object of this.objects){
            let interResult = object.rayIntersect(origin,direction);
            if(interResult[0] && <number>interResult[1] < dist){
                dist = <number>interResult[1];
                hit = <number[]>interResult[2];
                N = <number[]>interResult[3];
                material = object.material;
            }
        }
    
        //限定可视距离
        return [ dist < 1000,hit,N,material];
    }

    private castRay(orgin:number[],direction : number[], depth = 0):number[]{
        if(depth > this.maxDepth)
            return [0.2,0.7,0.8];
    
        //计算与场景中物体的最近交点
        let result = this.sceneIntersect(orgin,direction)
        if(!result[0]){
            return [0.2,0.7,0.8];
        }
    
        let point = <number[]>result[1];        //交点位置
        let N = <number[]>result[2];            //交点法线
        let material = <Material>result[3];     //交点材质
    
        let reflectDir = Vec3.normalize(reflect(direction,N));      //交点处反射光方向
        let refractDir = Vec3.normalize(refract(direction,N,material.refractiveIndex));     //交点处折射光方向
        let reflectOrigin = Vec3.dot(reflectDir,N) < 0?Vec3.minus(point,Vec3.multiply(N,1e-3)):Vec3.add(point,Vec3.multiply(N,1e-3));   //对交点位置进行扰动
        let refractOrigin = Vec3.dot(refractDir,N) < 0?Vec3.minus(point,Vec3.multiply(N,1e-3)):Vec3.add(point,Vec3.multiply(N,1e-3));   //同上
        let reflectColor = this.castRay(reflectOrigin,reflectDir,depth+1);      //再以交点与反射光进行颜色计算
        let refractColor = this.castRay(refractOrigin,refractDir,depth+1);      //再以交点与折射光进行颜色计算

        let diffuseLightIntensity = 0;
        let specularLightIntensity = 0;
    
        //通过从光源处散发的光线计算阴影（引出实时阴影技术）
        for(let light of this.lights){
            let lightDir = Vec3.normalize(Vec3.minus(light.position, point));   //交点到光源的方向
            let lightDistance = Vec3.length(Vec3.minus(light.position, point)); //交点到光源的距离
    
            let shadowOrigin = Vec3.dot(lightDir,N) < 0?Vec3.minus(point,Vec3.multiply(N,1e-3)):Vec3.add(point,Vec3.multiply(N,1e-3));  //同上
            let tmpResult = this.sceneIntersect(shadowOrigin,lightDir);
            //相交则舍弃该光线，并需要排除与“光源”背后物体相交的情况
            if(tmpResult[0]&&Vec3.length(Vec3.minus(<number[]>tmpResult[1],shadowOrigin)) < lightDistance){
                continue;
            }
    
            //累加光强
            diffuseLightIntensity += light.intensity * Math.max(0,Vec3.dot(lightDir,N));
            let tmpReflect = -Vec3.dot(reflect(Vec3.negate(lightDir),N),direction);
            specularLightIntensity += light.intensity *Math.pow(Math.max(0,tmpReflect),(material).specularExponent);
        }
    
        //将反射、折射以及阴影获取的颜色颜色叠加即为该像素点的颜色
        return Vec3.add(Vec3.add(Vec3.add(Vec3.multiply(material.diffuseColor,diffuseLightIntensity*material.albedo[0]),Vec3.multiply([1,1,1],specularLightIntensity*material.albedo[1])), Vec3.multiply(reflectColor,material.albedo[2])),Vec3.multiply(refractColor,material.albedo[3]));
    }
}