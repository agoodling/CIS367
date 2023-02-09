var gl;
var points;
var verticies

var x = 0.0;
var y = 0.0;
var xLoc, yLoc;
var dirs = [null,null];

window.onload = function init() {
    // Setup canvas and WebGL
    var canvas = document.getElementById('gl-canvas');
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {alert('WebGL unavailable');}

    window.addEventListener(
    "keydown",
    function(e){
        console.log("Keycode: " + e.keyCode);
        if (e.keyCode == 37) {
            dirs[0] = false;
          } else if (e.keyCode == 39) {
            dirs[0] = true;
          } else if (e.keyCode == 38) {
            dirs[1] = true;
          } else if (e.keyCode == 40) {
            dirs[1] = false;
          } else if (e.keyCode == 32) {
            dirs[0] = null;
            dirs[1] = null;
          }
    },
    false
    );

    //Triangle vertices
    vertices = [
         vec2(-0.25, -0.25),
         vec2( 0.00,  0.25),
         vec2( 0.25, -0.25)
    ];
    // configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // load and initialize shaders
    var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);
    xLoc = gl.getUniformLocation(program, "x");
    yLoc = gl.getUniformLocation(program, "y");


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
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // x += 0.1;
    // y += 0.1;
    gl.uniform1f(xLoc, x);
    gl.uniform1f(yLoc, y);
    if (dirs[0] === true) // move right
        x += 0.01;
    else if (dirs[0] === false) // move left
        x -= 0.01;

    if (dirs[1] === true) // move up
        y += 0.01;
    else if (dirs[1] === false) // move down 
        y -= 0.01;  

    window.requestAnimationFrame(render);

}


    