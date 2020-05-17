"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class MyConfig {
    constructor(path = './myconfig.json') {
        let data = fs.readFileSync(path, "utf8");
        let jsonObject = JSON.parse(data);
        this.defaultHtml = jsonObject.defaultHtml;
        this.defaultSuffix = jsonObject.defaultSuffix;
    }
}
exports.MyConfig = MyConfig;
//# sourceMappingURL=MyConfig.js.map