function objectToText(object) {
    Object.keys(object).map(function (key) {
        object[key] = object[key]._text;
    });
    return object;
}
export default objectToText;