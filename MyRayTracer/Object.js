"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectBase = void 0;
const Material_1 = require("./Material");
//场景对象基类
class ObjectBase {
    constructor(m) {
        if (m === undefined)
            this.material = new Material_1.Material();
        else
            this.material = m;
    }
    rayIntersect(origin, direction) {
        return [false, 0, [0, 0, 0], [0, 0, 0]];
    }
}
exports.ObjectBase = ObjectBase;
//# sourceMappingURL=Object.js.map