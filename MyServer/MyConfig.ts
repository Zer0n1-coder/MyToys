import * as fs from "fs";

export class MyConfig {
    faultHtml: string;
    faultSuffix: string;

    constructor(path = './myconfig.json') {
        let data = fs.readFileSync(path, "utf8");
        let jsonObject = JSON.parse(data);
        this.faultHtml = jsonObject.faultHtml;
        this.faultSuffix = jsonObject.faultSuffix;
    }
}