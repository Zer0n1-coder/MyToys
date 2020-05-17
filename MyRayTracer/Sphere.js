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
exports.Sphere = void 0;
const Vec3 = __importStar(require("./Vec3"));
const Object_1 = require("./Object");
//球对象
class Sphere extends Object_1.ObjectBase {
    constructor(c, r, m) {
        super();
        this.center = c;
        this.radius = r;
        this.material = m;
    }
    //光线与球求交判断
    rayIntersect(origin, direction) {
        let L = [this.center[0] - origin[0], this.center[1] - origin[1], this.center[2] - origin[2]];
        let tca = Vec3.dot(L, direction);
        let d2 = Vec3.dot(L, L) - tca * tca;
        if (d2 > this.radius * this.radius)
            return [false, 0, [0, 0, 0], [0, 0, 0]];
        let thc = Math.sqrt(this.radius * this.radius - d2);
        let t0 = tca - thc;
        let t1 = tca + thc;
        if (t0 < 0) {
            t0 = t1;
            return [false, t0, [0, 0, 0], [0, 0, 0]];
        }
        let hit = Vec3.add(origin, Vec3.multiply(direction, t0));
        let N = Vec3.normalize((Vec3.minus(hit, this.center)));
        return [true, t0, hit, N];
    }
}
exports.Sphere = Sphere;
//# sourceMappingURL=Sphere.js.map