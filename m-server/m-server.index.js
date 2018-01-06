var http = require('http');

import { conf, controllers } from './shared';

import routerStatic from './router.static';
import routerApi from './router.api';

var _api_conf;

export default function(in_) {
    Object.assign(conf, in_.conf);
    Object.assign(controllers, in_.controllers);

    _api_conf = in_.api;

    routerApi.init();
    routerStatic.init();

    http.createServer(_server_response).listen(conf.port);
    console.log('listen :' + conf.port);
}

function _server_response(request, response) {
    (_api_conf.filter(request) ? routerApi : routerStatic).request(
        request,
        response
    );
}
