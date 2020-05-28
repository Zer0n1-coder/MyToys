export function getTextFromLocation(path) {
    let request = new XMLHttpRequest;
    request.open('GET', path, false);
    request.send();
    return request.responseText;
}
