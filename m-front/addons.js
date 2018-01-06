function addons(in_) {
    /* eslint-disable no-undef */
    Object.assign(app.routes, in_.routes);
    app.loadAddons_resolve(); // [!] unlock loadAddons Promise
    /* eslint-enable no-undef */
}

export { addons };
