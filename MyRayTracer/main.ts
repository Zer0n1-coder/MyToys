import { RayTracerRenderer } from "./Renderer";
import { Sphere } from "./Sphere";
import { Material } from "./Material";
import { Light } from "./Light";
import { Board } from "./Board";
import { ObjectBase } from "./Object";
import { Wall } from "./Wall";

//生成场景对象
function genObjects(objects:ObjectBase[]){
    let ivory =     new Material(1.0, [0.6,  0.3, 0.1, 0.0], [0.4, 0.4, 0.3], 50);
    let glass =     new Material(1.5, [0.0,  0.5, 0.1, 0.8], [0.6, 0.7, 0.8], 125);
    let redRubber = new Material(1.0, [0.9,  0.1, 0.0, 0.0], [0.3, 0.1, 0.1], 10);
    let mirror =    new Material(1.0, [0.0, 10.0, 0.8, 0.0], [1.0, 1.0, 1.0], 1425);

    let sphere = new Sphere([4, 0, -16], 2,ivory);
    objects.push(sphere);
    sphere =     new Sphere([4.0, -1.5, -9], 2,glass);
    objects.push(sphere);
    sphere =     new Sphere([-1.0, -0.5, -13], 3,redRubber);
    objects.push(sphere);
    sphere =     new Sphere([8, 5.5, -18], 4,mirror);
    objects.push(sphere);

    let board = new Board();
    objects.push(board);

    let wall = new Wall();
    objects.push(wall);
}

function main(){
    //生成场景光源
    let lights = new Array<Light>();
    lights.push(new Light([-20, 20,  20], 1.5));
    lights.push(new Light([ 30, 50, -25], 1.8));
    lights.push(new Light([ 30, 20,  30], 1.7));

    let objects = new Array<ObjectBase>();
    genObjects(objects);

    let renderer = new RayTracerRenderer();
    renderer.objects = objects;
    renderer.lights = lights;
    renderer.render();
}

main();