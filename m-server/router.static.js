var fs = require('fs'),
    path = require('path'),
    url = require('url');

import { conf } from './shared';
export default {
    init: _router_static_init,
    request: _on_router_static_request
};

var _root,
    _encoding,
    mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'image/svg+xml'
    };

function _router_static_init() {
    _root = conf.root;
    _encoding = conf.encoding;
}

function _on_router_static_request(request, response) {
    var _url = url.parse(request.url, true).pathname,
        _filePath = _root + (_url === '/' ? '/index.html' : _url),
        _extname = String(path.extname(_filePath)).toLowerCase(),
        _contentType = mimeTypes[_extname] || 'application/octet-stream';

    fs.readFile(_filePath, function(error, content) {
        if (error !== null) {
            if (error.code === 'ENOENT') {
                response.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                response.end(
                    '<h1>router.static.js - 404 not found</h1><br/><h3>' +
                        request.url +
                        '</h3>',
                    _encoding
                );
            } else {
                response.writeHead(500, {
                    'Content-Type': 'text/html'
                });
                response.end(
                    '<h1>Sorry, check with the site admin for error: ' +
                        error.code +
                        '</h1><br/><h3>' +
                        request.url +
                        '</h3>',
                    _encoding
                );
            }
        } else {
            response.writeHead(200, { 'Content-Type': _contentType });
            response.end(content, _encoding);
        }
    });
}
