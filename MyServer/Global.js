function getWebGL() {
    let canvas = document.getElementById('webgl');
    let tmpContext = canvas.getContext('webgl2');
    if (!tmpContext) {
        alert('Failed to get the rendering context for WebGL');
    }
    return tmpContext;
}
export let gl = getWebGL();
