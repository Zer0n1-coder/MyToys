"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const path = require("path");
const fs = require("fs");
const url = require("url");
const Global1_1 = require("./Global1");
http.createServer(function (req, res) {
    let uri = url.parse(req.url).pathname;
    let filename = path.join(__dirname, uri);
    let contentType;
    if (filename[filename.length - 1] === '\\') {
        if (Global1_1.config.defaultHtml !== undefined)
            filename += Global1_1.config.defaultHtml;
        else
            filename += 'index.html';
        contentType = "text/html;charset=utf-8";
    }
    else if (filename.indexOf('.') === -1) {
        if (Global1_1.config.defaultSuffix !== undefined) {
            filename += '.' + Global1_1.config.defaultSuffix;
            contentType = Global1_1.types[Global1_1.config.defaultSuffix];
        }
        else {
            filename += '.js';
            contentType = "text/javascript;charset=utf-8";
        }
    }
    else {
        let str = filename.split('.');
        let type = str[str.length - 1];
        contentType = Global1_1.types[type];
    }
    //响应回调
    let callback = function (exists) {
        if (!exists) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('404 Not Found\n');
            res.end('Hello World!\n');
            return;
        }
        fs.readFile(filename, function (err, data) {
            if (err || contentType === undefined) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(err);
            }
            else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.write(data, "text");
                res.end();
            }
        });
    };
    fs.exists(filename, callback);
}).listen(Global1_1.port);
console.log('Static file server running at ' + Global1_1.site);
//# sourceMappingURL=server.js.map