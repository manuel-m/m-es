import S from 's-js';
import * as Surplus from 'surplus';

import { loadScript } from './script';
import { routerView } from './router';

function App(in_) {
    var __context = {
            S: S,
            Surplus: Surplus,
            model: {},
            routes: in_.routes,
            vm: {}
        },
        _static = document.getElementById(in_.mountId),
        _routerView;

    Object.assign(__context.model, in_.model(__context));
    Object.assign(__context.vm, in_.vm(__context));

    __context.loadAddons = new Promise(function(resolve) {
        __context.loadAddons_resolve = resolve;
    });

    _routerView = routerView({
        context: __context,
        defaultRoute: in_.defaultRoute,
        onHashChange: in_.onHashChange
    });

    window.requestAnimationFrame(function() {
        _static.parentNode.replaceChild(_routerView, _static);
        _routerView.id = in_.mountId;
        _static = undefined;

        loadScript(in_.addonsScript);
    });

    return __context;
}

export { App };
