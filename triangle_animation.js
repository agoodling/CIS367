var gl;
var points;
var verticies
window.onload = function init() {
    // Setup canvas and WebGL
    var canvas = document.getElementById('gl-canvas');
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {alert('WebGL unavailable');}

    //Triangle vertices
    vertices = [
        vec2(0,0),



        // vec2(-1, -1),
        // vec2(0, 1),
        // vec2(1, -1)
        
    ];
    for(let t = 0 ; t < Math.PI *2.0 + Math.PI/256; t += Math.PI / 4){// The 2 at the end determines the sides
        let x = 0.75 * Math.cos(t);
        let y = 0.75 * Math.sin(t);

        vertices.push(vec2(x,y));

    }

    // configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // load and initialize shaders
    var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    // load data into GPU
    var bufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    // set position and render
    var vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length);}


    