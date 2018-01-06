export { play };

var _delay_ms,
    _max_fails,
    _m,
    _module,
    reactors = {
        clic: clic
    };

function play(in_) {
    _module = in_.module;
    _delay_ms = in_.automation.delay_ms;
    _max_fails = in_.automation.max_fails;
    return fetch(in_.automation.path)
        .then(function(payload_) {
            return payload_.json();
        })
        .then(function(response_) {
            _m = JSON.parse(JSON.stringify(response_));
            in_.module.onStart(_m).then(function() {
                _m.sequence.length > 0 && _play_run();
            });
        });
}

function _play_processStep(step_) {
    var _reactor = step_.split('.').pop();
    return new Promise(function(resolve, reject) {
        if (_reactor === 'wait') {
            resolve();
        } else {
            reactors[_reactor](_m.steps[step_], resolve, reject);
        }
    });
}

function _play_run() {
    var _step = _m.sequence.shift();
    _play_processStep(_step)
        .then(function() {
            return _module.onStepDone(_m, _step);
        })
        .then(_play_next);
}

function _play_next() {
    if (_m.sequence.length > 0) {
        setTimeout(_play_run, _delay_ms);
    } else {
        _play_end();
    }
}

function _play_end() {
    _module.onEnd(_m);
}

function clic(selector_, resolve, reject) {
    var _node,
        _remainingTries = _max_fails;

    _processClic();

    function _processClic() {
        _node = document.querySelector(selector_);
        if (_node === null) {
            if (_remainingTries > 0) {
                _remainingTries -= 1;
                setTimeout(_processClic, _delay_ms);
            } else {
                console.error('invalid selector' + selector_);
                reject();
            }
        } else {
            _node.click();
            resolve();
        }
    }
}
