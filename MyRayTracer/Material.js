"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = void 0;
//材质对象
class Material {
    constructor(r, a, color, spec) {
        if (color !== undefined && a !== undefined && spec !== undefined && r !== undefined) {
            this.diffuseColor = color;
            this.albedo = a;
            this.specularExponent = spec;
            this.refractiveIndex = r;
        }
        else {
            this.diffuseColor = [0, 0, 0];
            this.albedo = [1, 0, 0, 0];
            this.specularExponent = 0;
            this.refractiveIndex = 1;
        }
    }
}
exports.Material = Material;
//# sourceMappingURL=Material.js.map