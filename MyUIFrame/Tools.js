import { Texture2D } from "./Texture2D";
import { gl } from "./RenderContext";
export function getTextFromLocation(path) {
    let request = new XMLHttpRequest;
    request.open('GET', path, false);
    request.send();
    return request.responseText;
}
export function loadTextureFromFile(id, alpha) {
    let texture = new Texture2D();
    if (alpha) {
        texture.internalFormat = gl.RGBA;
        texture.imageFormat = gl.RGBA;
    }
    texture.generate(id);
    return texture;
}
