export function getTextFromLocation(path: string) {
    let request = new XMLHttpRequest;

    request.open('GET', path, false);
    request.send();

    return request.responseText;
}

