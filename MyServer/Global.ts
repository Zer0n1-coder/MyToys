import { MyConfig } from "./MyConfig";

//端口号
export let port = process.env.port || 1337;
export let site = 'http://localhost:' + port;

//读取配置文件
export let config = new MyConfig();

//设置响应类型
export let types = {
    html: 'text/html;charset=utf-8',
    png: "image/png",
    jpg: "image/jpeg",
    txt: "text/plain;charset=utf-8",
    js: "text/javascript;charset=utf-8",
    obj:"text/plain;charset=utf-8"
};