"use strict";

var canvas;
var gl;

var x1 = -1;
var y1 = -1;
var x2 = 0;
var y2 = 1;
var x3 = 1;
var y3 = -1;

var index = 0;

var points = [];

var numTimesToSubdivide = 0;

var cIndex = 0;

var colors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);


    var vertices = [
        vec2(x1, y1),
        vec2(x2, y2),
        vec2(x3, y3)
    ];


    divideTriangle(vertices[0], vertices[1], vertices[2],
        numTimesToSubdivide);


    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 50000, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

    let _colors = [];
    for (let _ = 0; _ < points.length; _++) {
        _colors.push(colors[cIndex])
    }
    gl.bufferData(gl.ARRAY_BUFFER, flatten(_colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var m = document.getElementById("mymenu");

    m.addEventListener("click", function () {
        cIndex = m.selectedIndex;

        // var t = vec4(colors[cIndex]);
        // gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index), flatten(t));
        // gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + 1), flatten(t));
        // gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + 2), flatten(t));

    });

    document.getElementById("slider").onchange = function (event) {
        numTimesToSubdivide = parseInt(event.target.value);
    };




    canvas.addEventListener("mouseup", function (event) {
        //console.log(event.clientX, event.clientY);
        var rect = gl.canvas.getBoundingClientRect();
        var newx = (event.clientX - rect.left) / canvas.width * 2 - 1;
        var newy = (event.clientY - rect.top) / canvas.height * -2 + 1;
        console.log(newx, newy);
        var vertex_id = document.querySelector('input[name="vertex"]:checked').value;
        if (vertex_id == 0) {
            x1 = newx;
            y1 = newy;
        }
        else if (vertex_id == 1) {
            x2 = newx;
            y2 = newy;
        } else {
            x3 = newx;
            y3 = newy;
        }
    });
    render();
};

function triangle(a, b, c) {
    points.push(a, b, c);
}

function divideTriangle(a, b, c, count) {

    // check for end of recursion

    if (count === 0) {
        triangle(a, b, c);
    }
    else {

        //bisect the sides

        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        --count;

        // three new triangles

        divideTriangle(a, ab, ac, count);
        divideTriangle(c, ac, bc, count);
        divideTriangle(b, bc, ab, count);
    }
}

window.onload = init;

function render() {
    //console.log(points)
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    points = [];
    requestAnimFrame(init);
}
