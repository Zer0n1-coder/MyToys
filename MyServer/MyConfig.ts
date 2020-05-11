import * as fs from "fs";

export class MyConfig {
    defaultHtml: string;
    defaultSuffix: string;

    constructor(path = './myconfig.json') {
        let data = fs.readFileSync(path, "utf8");
        let jsonObject = JSON.parse(data);
        this.defaultHtml = jsonObject.defaultHtml;
        this.defaultSuffix = jsonObject.defaultSuffix;
    }
}