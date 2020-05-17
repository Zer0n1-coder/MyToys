"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Renderer_1 = require("./Renderer");
const Sphere_1 = require("./Sphere");
const Material_1 = require("./Material");
const Light_1 = require("./Light");
const Board_1 = require("./Board");
const Wall_1 = require("./Wall");
//生成场景对象
function genObjects(objects) {
    let ivory = new Material_1.Material(1.0, [0.6, 0.3, 0.1, 0.0], [0.4, 0.4, 0.3], 50);
    let glass = new Material_1.Material(1.5, [0.0, 0.5, 0.1, 0.8], [0.6, 0.7, 0.8], 125);
    let redRubber = new Material_1.Material(1.0, [0.9, 0.1, 0.0, 0.0], [0.3, 0.1, 0.1], 10);
    let mirror = new Material_1.Material(1.0, [0.0, 10.0, 0.8, 0.0], [1.0, 1.0, 1.0], 1425);
    let sphere = new Sphere_1.Sphere([4, 0, -16], 2, ivory);
    objects.push(sphere);
    sphere = new Sphere_1.Sphere([4.0, -1.5, -9], 2, glass);
    objects.push(sphere);
    sphere = new Sphere_1.Sphere([-1.0, -0.5, -13], 3, redRubber);
    objects.push(sphere);
    sphere = new Sphere_1.Sphere([8, 5.5, -18], 4, mirror);
    objects.push(sphere);
    let board = new Board_1.Board();
    objects.push(board);
    let wall = new Wall_1.Wall();
    objects.push(wall);
}
function main() {
    //生成场景光源
    let lights = new Array();
    lights.push(new Light_1.Light([-20, 20, 20], 1.5));
    lights.push(new Light_1.Light([30, 50, -25], 1.8));
    lights.push(new Light_1.Light([30, 20, 30], 1.7));
    let objects = new Array();
    genObjects(objects);
    let renderer = new Renderer_1.RayTracerRenderer();
    renderer.objects = objects;
    renderer.lights = lights;
    renderer.render();
}
main();
//# sourceMappingURL=main.js.map