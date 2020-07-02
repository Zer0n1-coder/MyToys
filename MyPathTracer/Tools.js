"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toInt = exports.clamp = void 0;
function clamp(x) {
    return x < 0 ? 0 : 0 > 1 ? 1 : x;
}
exports.clamp = clamp;
function toInt(x) {
    return 0 | (Math.pow(clamp(x), 1 / 2.2) * 255 + 0.5);
}
exports.toInt = toInt;
//# sourceMappingURL=Tools.js.map