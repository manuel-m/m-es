export { routerView };

function routerView(in_) {
    var Surplus = in_.context.Surplus,
        _route = in_.defaultRoute,
        _routes = {},
        go = in_.context.S.data(_route);

    // start with default route
    if (document.location.hash === '') {
        _routes[_route] = in_.context.routes[_route](Surplus, in_.context);
    } else {
        // start with addon route
        in_.context.loadAddons.then(function() {
            _route = in_.onHashChange(in_.context);
            _routes[_route] = in_.context.routes[_route](Surplus, in_.context);
            go(_route);
        });
    }

    window.addEventListener('hashchange', function(e_) {
        in_.context.loadAddons.then(function() {
            _route = in_.onHashChange(in_.context, e_);
            if (_route in _routes === false) {
                // [!] create view on need
                _routes[_route] = in_.context.routes[_route](
                    Surplus,
                    in_.context
                );
            }
            go(in_.onHashChange(in_.context, e_));
        });
    });

    return <div>{_routes[go()]}</div>;
}
