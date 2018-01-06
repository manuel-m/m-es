var d = document;

// IE9+
function _ready(fn) {
    if (
        d.attachEvent ? d.readyState === 'complete' : d.readyState !== 'loading'
    ) {
        fn();
    } else {
        d.addEventListener('DOMContentLoaded', fn);
    }
}

export { loadScript, loadScriptOnDomReady };

function loadScript(path_) {
    var e = d.createElement('script');
    e.src = path_;
    e.async = true;
    d.head.insertBefore(
        e,
        d.head.childNodes[d.head.childNodes.length - 1].nextSibling
    );
}

function loadScriptOnDomReady(path_) {
    _ready(function() {
        var e = d.createElement('script');
        e.src = path_;
        e.async = true;
        d.head.insertBefore(
            e,
            d.head.childNodes[d.head.childNodes.length - 1].nextSibling
        );
    });
}
