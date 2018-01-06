export { wrapResponse };

function wrapResponse(o) {
    return { content: JSON.stringify(o, undefined, 2) };
}
