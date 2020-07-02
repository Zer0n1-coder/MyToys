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
class Sphere {
    constructor(rad, p, e, c, m) {
        this.rad = rad;
        this.p = p;
        this.e = e;
        this.c = c;
        this.m = m;
    }
    intersect(r) {
        let op = Vec3.minus(this.p, r.o);
        let t;
        let eps = 1e-4;
        let b = Vec3.dot(op, r.d);
        let det = b * b - Vec3.dot(op, op) + this.rad * this.rad;
        if (det < 0)
            return 0;
        else
            det = Math.sqrt(det);
        return (t = b - det) > eps ? t : ((t = b + det) > eps ? t : 0);
    }
}
exports.Sphere = Sphere;
//# sourceMappingURL=Sphere.js.map