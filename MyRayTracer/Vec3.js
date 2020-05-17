"use strict";
//三维向量（顶点）的基本运算
Object.defineProperty(exports, "__esModule", { value: true });
exports.length = exports.negate = exports.multiply = exports.minus = exports.normalize = exports.add = exports.dot = void 0;
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
exports.dot = dot;
function add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
exports.add = add;
function normalize(a) {
    let length = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
    let bLength = 1 / length;
    return [a[0] * bLength, a[1] * bLength, a[2] * bLength];
}
exports.normalize = normalize;
function minus(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
exports.minus = minus;
function multiply(a, b) {
    if (typeof b === "number")
        return [a[0] * b, a[1] * b, a[2] * b];
    else
        return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}
exports.multiply = multiply;
function negate(a) {
    return [-a[0], -a[1], -a[2]];
}
exports.negate = negate;
function length(a) {
    return Math.hypot(a[0], a[1], a[2]);
}
exports.length = length;
//# sourceMappingURL=Vec3.js.map