"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const fs = __importStar(require("fs"));
const Sphere_1 = require("./Sphere");
const Materials_1 = require("./Materials");
const Ray_1 = require("./Ray");
const Vec3 = __importStar(require("./Vec3"));
const Tools_1 = require("./Tools");
let spheres = [
    new Sphere_1.Sphere(1e5, [1e5 + 1, 40.8, 81.6], [0, 0, 0], [0.75, 0.25, 0.25], Materials_1.MaterialTypes.DIFF),
    new Sphere_1.Sphere(1e5, [-1e5 + 99, 40.8, 81.6], [0, 0, 0], [.25, .25, .75], Materials_1.MaterialTypes.DIFF),
    new Sphere_1.Sphere(1e5, [50, 40.8, 1e5], [0, 0, 0], [.75, .75, .75], Materials_1.MaterialTypes.DIFF),
    new Sphere_1.Sphere(1e5, [50, 40.8, -1e5 + 170], [0, 0, 0], [0, 0, 0], Materials_1.MaterialTypes.DIFF),
    new Sphere_1.Sphere(1e5, [50, 1e5, 81.6], [0, 0, 0], [.75, .75, .75], Materials_1.MaterialTypes.DIFF),
    new Sphere_1.Sphere(1e5, [50, -1e5 + 81.6, 81.6], [0, 0, 0], [.75, .75, .75], Materials_1.MaterialTypes.DIFF),
    new Sphere_1.Sphere(16.5, [27, 16.5, 47], [0, 0, 0], [.999, .999, .999], Materials_1.MaterialTypes.SPEC),
    new Sphere_1.Sphere(16.5, [73, 16.5, 78], [0, 0, 0], [.999, .999, .999], Materials_1.MaterialTypes.REFR),
    new Sphere_1.Sphere(600, [50, 681.6 - .27, 81.6], [12, 12, 12], [0, 0, 0], Materials_1.MaterialTypes.DIFF)
];
function intersect(r, spheres) {
    let id = 0;
    let d;
    let t = Number.MAX_VALUE;
    for (let i = 0; i < spheres.length; ++i) {
        if ((d = spheres[i].intersect(r)) && d < t) {
            t = d;
            id = i;
        }
    }
    return [t < Number.MAX_VALUE, t, id];
}
function radiance(r, depth) {
    let iresult = intersect(r, spheres);
    if (!iresult)
        return [0, 0, 0];
    let t = iresult[1];
    let id = iresult[2];
    const obj = spheres[id];
    let x = Vec3.add(r.o, Vec3.multiply(r.d, t));
    let n = Vec3.normalize(Vec3.minus(x, obj.p));
    let n1 = Vec3.dot(n, r.d) < 0 ? [n[0], n[1], n[2]] : Vec3.negate(n);
    let f = obj.c;
    let p = f[0] > f[1] && f[0] > f[2] ? f[0] : f[1] > f[2] ? f[1] : f[2];
    if (++depth > 5)
        if (Math.random() < p)
            f = Vec3.multiply(f, 1 / p);
        else
            return obj.e;
    if (obj.m === Materials_1.MaterialTypes.DIFF) {
        let r1 = 2 * Math.PI * Math.random();
        let r2 = Math.random();
        let r2s = Math.sqrt(r2);
        let w = [n1[0], n1[1], n1[2]];
        let u = Vec3.normalize(Vec3.cross((Math.abs(w[0]) > 0.1 ? [0, 1, 0] : [1, 0, 0]), w));
        let v = Vec3.cross(w, u);
        let d = Vec3.normalize(Vec3.add(Vec3.add(Vec3.multiply(u, Math.cos(r1) * r2s), Vec3.multiply(v, Math.sin(r1) * r2s)), Vec3.multiply(w, Math.sqrt(1 - r2))));
        return Vec3.add(obj.e, Vec3.multiply(f, radiance(new Ray_1.Ray(x, d), depth)));
    }
    else if (obj.m === Materials_1.MaterialTypes.SPEC) // Ideal SPECULAR reflection 
        return Vec3.add(obj.e, Vec3.multiply(f, radiance(new Ray_1.Ray(x, Vec3.minus(r.d, Vec3.multiply(n, 2 * Vec3.dot(n, r.d)))), depth)));
    let reflRay = new Ray_1.Ray(x, Vec3.minus(r.d, Vec3.multiply(n, 2 * Vec3.dot(n, r.d))));
    let into = Vec3.dot(n, n1) > 0;
    let nc = 1;
    let nt = 1.5;
    let nnt = into ? nc / nt : nt / nc;
    let ddn = Vec3.dot(r.d, n1);
    let cos2t;
    if ((cos2t = 1 - nnt * nnt * (1 - ddn * ddn)) < 0) // Total internal reflection 
        return Vec3.add(obj.e, Vec3.multiply(f, radiance(reflRay, depth)));
    let tdir = Vec3.normalize(Vec3.minus(Vec3.multiply(r.d, nnt), Vec3.multiply(n, ((into ? 1 : -1) * (ddn * nnt + Math.sqrt(cos2t))))));
    let a = nt - nc;
    let b = nt + nc;
    let R0 = a * a / (b * b);
    let c = 1 - (into ? -ddn : Vec3.dot(tdir, n));
    let Re = R0 + (1 - R0) * c * c * c * c * c;
    let Tr = 1 - Re;
    let P = 0.25 + 0.5 * Re;
    let RP = Re / P;
    let TP = Tr / (1 - P);
    return Vec3.add(obj.e, Vec3.multiply(f, depth > 2 ? (Math.random() < P ? // Russian roulette 
        Vec3.multiply(radiance(reflRay, depth), RP) : Vec3.multiply(radiance(new Ray_1.Ray(x, tdir), depth), TP)) :
        Vec3.add(Vec3.multiply(radiance(reflRay, depth), Re), Vec3.multiply(radiance(new Ray_1.Ray(x, tdir), depth), Tr))));
}
function main() {
    let w = 1024, h = 768, samps = 8;
    let cam = new Ray_1.Ray([50, 52, 295.6], Vec3.normalize([0, -0.042612, -1]));
    let cx = [w * 0.5135 / h, 0, 0], cy = Vec3.multiply(Vec3.normalize(Vec3.cross(cx, cam.d)), 0.5135);
    let data = 'P3\n' + w.toString() + ' ' + h.toString() + '\n255\n';
    for (let y = 0; y < h; ++y) {
        for (let x = 0; x < w; ++x) {
            let c = [0, 0, 0];
            for (let sy = 0; sy < 2; ++sy) {
                for (let sx = 0; sx < 2; ++sx) {
                    let r = [0, 0, 0];
                    for (let s = 0; s < samps; ++s) {
                        let r1 = 2 * Math.random();
                        let dx = r1 < 1 ? Math.sqrt(r1) - 1 : 1 - Math.sqrt(2 - r1);
                        let r2 = 2 * Math.random();
                        let dy = r2 < 1 ? Math.sqrt(r2) - 1 : 1 - Math.sqrt(2 - r2);
                        let d = Vec3.add(Vec3.add(Vec3.multiply(cx, (((sx + 0.5 + dx) / 2 + x) / 2 - 0.5)), Vec3.multiply(cy, (((sy + 0.5 + dy) / 2 + y) / h - 0.5))), cam.d);
                        r = Vec3.add(r, radiance(new Ray_1.Ray(Vec3.add(cam.o, Vec3.multiply(d, 140)), Vec3.normalize(d)), 0));
                    }
                    c = Vec3.add(c, [Tools_1.clamp(r[0]) * .25, Tools_1.clamp(r[1]) * .25, Tools_1.clamp(r[2]) * .25]);
                }
            }
            let num = Tools_1.toInt(c[0]);
            data += num.toString() + ' ';
            num = Tools_1.toInt(c[1]);
            data += num.toString() + ' ';
            num = Tools_1.toInt(c[2]);
            data += num.toString() + '\n';
        }
    }
    fs.writeFile('./out.ppm', data, function (err) {
        if (err)
            console.log('writing file is failed!');
    });
    console.log("finish it!");
}
exports.main = main;
main();
//# sourceMappingURL=main.js.map