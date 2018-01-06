export { clone, fetch_json };

function clone(in_) {
    return JSON.parse(JSON.stringify(in_));
}

function fetch_json(response_) {
    return response_.json();
}
