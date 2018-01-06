var url = require('url');

import { conf, controllers } from './shared';

var _encoding = conf.encoding,
    _entryPointToController = {
        GET: {},
        POST: {},
        PUT: {},
        DELETE: {}
    },
    _entryPointToControllerWithRegExp = {
        GET: {},
        POST: {},
        PUT: {},
        DELETE: {}
    };

export default {
    init: _entry_point_to_controller_populate,
    request: _on_router_api_request
};

function _on_router_api_request(request, response) {
    var _bodyContent;

    // POST || PUT
    if (request.method[0] === 'P') {
        _bodyContent = '';
        request.on('data', function(data) {
            _bodyContent += data;
        });

        request.on('end', function() {
            _api_request_process(
                request,
                response,
                Object.assign(
                    JSON.parse(_bodyContent),
                    url.parse(request.url, true).query
                )
            );
        });
    } else {
        _api_request_process(
            request,
            response,
            url.parse(request.url, true).query
        );
    }
}

function _api_request_process(request_, response_, params_) {
    var _url = url.parse(request_.url, true),
        _entryPoint = _url.pathname,
        _method = request_.method;

    if (_entryPointToController[_method][_entryPoint] !== undefined) {
        // basic url routing
        _api_router_send_response(
            response_,
            _entryPointToController[_method][_entryPoint](params_)
        );
    } else {
        // find routing with regexp
        var _findKey = Object.keys(
            _entryPointToControllerWithRegExp[_method]
        ).find(function(key_) {
            var _entryPointData =
                    _entryPointToControllerWithRegExp[_method][key_],
                check = _entryPoint.match(_entryPointData.regexp);

            if (check !== null) {
                Object.assign(
                    params_,
                    _entryPointData.params.reduce(function(
                        result,
                        item,
                        index
                    ) {
                        result[item] = check[index + 1];
                        return result;
                    },
                    {})
                );

                _api_router_send_response(
                    response_,
                    _entryPointData.callback(params_)
                );

                return true;
            }
            return false;
        });

        // no routing found => 404
        if (_findKey === undefined) {
            console.log(
                'Undefined api result : ' +
                    _method +
                    ' - "' +
                    _entryPoint +
                    '" with params ' +
                    JSON.stringify(params_)
            );

            _api_router_send_not_found(response_, request_);
        }
    }
}

function _api_router_send_response(response, result) {
    response.writeHead('code' in result ? result.code : 200, {
        'Content-Type': 'type' in result ? result.type : 'application/json'
    });

    if ('delay' in result) {
        setTimeout(function() {
            response.end(result.content, _encoding);
        }, result.delay);
    } else {
        response.end(result.content, _encoding);
    }
}

function _api_router_send_not_found(response, request) {
    response.writeHead(404, {
        'Content-Type': 'text/html'
    });
    response.end(
        '<h1>router.api.js - 404 not found</h1><br/><h3>' +
            request.url +
            '</h3>',
        _encoding
    );
}

function _entry_point_to_controller_populate() {
    console.log('----------------------------------------------------');
    console.log('List of Api controller existing :');

    Object.keys(controllers).forEach(function(key_) {
        var controller_ = controllers[key_];

        _entry_point_to_controller_populate_by_method(controller_, 'GET');
        _entry_point_to_controller_populate_by_method(controller_, 'POST');
        _entry_point_to_controller_populate_by_method(controller_, 'PUT');
        _entry_point_to_controller_populate_by_method(controller_, 'DELETE');
    });

    console.log('----------------------------------------------------');
}

function _entry_point_to_controller_populate_by_method(controller_, method_) {
    if (method_ in controller_ === false) return;

    Object.keys(controller_[method_]).forEach(function(controllerKey_) {
        if (controllerKey_.indexOf('/') !== 0)
            // not an uri entry point
            return;

        console.log(controllerKey_);
        if (controllerKey_.indexOf(':') >= 0) {
            // routing with regexp
            var params = [],
                stringRegexp = controllerKey_
                    .split('/')
                    .map(function(value) {
                        if (value.indexOf(':') === 0) {
                            params.push(value.substr(1));
                            return '([0-9a-zA-Z_-]+)';
                        } else return value;
                    })
                    .join('/'); // TODO : to be modified using RegExp

            _entryPointToControllerWithRegExp[method_][controllerKey_] = {
                callback: controller_[method_][controllerKey_],
                params: params,
                regexp: new RegExp('^' + stringRegexp + '$', 'i')
            };
        } else {
            // basic url routing
            _entryPointToController[method_][controllerKey_] =
                controller_[method_][controllerKey_];
        }
    });
}
