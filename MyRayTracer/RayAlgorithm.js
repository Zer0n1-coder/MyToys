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
exports.refract = exports.reflect = void 0;
const Vec3 = __importStar(require("./Vec3"));
//求反射光线方向
function reflect(I, N) {
    return Vec3.minus(I, Vec3.multiply(Vec3.multiply(N, 2), Vec3.dot(I, N)));
}
exports.reflect = reflect;
//求折射光线方向
function refract(I, N, etat, etai = 1) {
    let cosi = -Math.max(-1, Math.min(1, Vec3.dot(I, N)));
    if (cosi < 0) {
        refract(I, Vec3.negate(N), etai, etat);
    }
    let eta = etai / etat;
    let k = 1 - eta * eta * (1 - cosi * cosi);
    return k < 0 ? [1, 0, 0] : Vec3.add(Vec3.multiply(I, eta), Vec3.multiply(N, eta * cosi - Math.sqrt(k)));
}
exports.refract = refract;
//# sourceMappingURL=RayAlgorithm.js.map