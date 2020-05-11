import * as http from "http";
import * as path from "path";
import * as fs from "fs";
import * as url from "url";

import { types, port, site, config } from "./Global";

http.createServer(function (req, res) {
    let uri = url.parse(req.url).pathname;
    let filename = path.join(__dirname, uri);

    let contentType: string;
    if (filename[filename.length - 1] === '\\') {
        if (config.faultHtml !== undefined)
            filename += config.faultHtml;
        else
            filename += 'index.html';

        contentType = "text/html;charset=utf-8";
    }
    else if (filename.indexOf('.') === -1) {
        if (config.faultSuffix !== undefined) {
            filename += '.' + config.faultSuffix;
            contentType = types[config.faultSuffix];
        }
        else {
            filename += '.js';
            contentType = "text/javascript;charset=utf-8";
        }
    }
    else {
        let str = filename.split('.');
        let type = str[str.length - 1];
        contentType = types[type];
    }

    //响应回调
    let callback = function (exists: boolean) {
        if (!exists) {
            res.writeHead(404, { 'Content-Type': 'text/plain'});
            res.write('404 Not Found\n');
            res.end('Hello World!\n');
            return;
        }

        fs.readFile(filename, function (err: NodeJS.ErrnoException | null, data: Buffer) {
            if (err || contentType === undefined) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(err);
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.write(data, "text");
                res.end();
            }
        });
    };
    fs.exists(filename, callback);

}).listen(port);

console.log('Static file server running at ' + site);