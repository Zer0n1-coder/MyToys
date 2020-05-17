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
exports.Wall = void 0;
const Object_1 = require("./Object");
const Vec3 = __importStar(require("./Vec3"));
//墙对象
class Wall extends Object_1.ObjectBase {
    constructor() {
        super();
        this.pos = -6;
        this.height = 40;
        this.width = 40;
        this.center = [10, -20];
        this.material.diffuseColor = [0.5, 0.0, 0.0];
        this.material.diffuseColor = Vec3.multiply(this.material.diffuseColor, 0.3);
    }
    rayIntersect(origin, direction) {
        if (Math.abs(direction[0]) > 1e-3) {
            let d = -(origin[0] - this.pos) / direction[0]; // “光源”沿着光线方向到平面的距离。
            let pt = Vec3.add(origin, Vec3.multiply(direction, d)); //交点坐标
            if (d > 0 && pt[1] < (this.center[0] + this.height / 2) && pt[1] > (this.center[0] - this.height / 2) && pt[2] < (this.center[1] + this.width / 2) && pt[2] > (this.center[1] - this.width / 2)) { //限定矩形的大小
                let t0 = d;
                let hit = pt;
                let N = [1, 0, 0];
                return [true, t0, hit, N];
            }
        }
        return [false, 0, [0, 0, 0], [0, 0, 0]];
    }
}
exports.Wall = Wall;
//# sourceMappingURL=Wall.js.map