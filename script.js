const canvas = document.getElementById('gl-test');
const gl = canvas.getContext('webgl');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

const vertexShaderSource = `
  attribute vec2 position;
  uniform float width;
  void main() {
    gl_PointSize = width;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

function addRandomPoint() {
    const randomX = Math.random() * canvas.width;
    const randomY = Math.random() * canvas.height;
    addPoint(randomX, randomY);
  }

const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 0.5, 1.0, 1.0);
  }
`;
function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }
  
  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
  
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);
  
  const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

let points = [];
function addPoint(x, y) {
  const xWebGL = (x / canvas.width) * 2 - 1;
  const yWebGL = (y / canvas.height) * -2 + 1;
  points.push(xWebGL, yWebGL);
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
  drawLine();
}

canvas.addEventListener('click', (event) => {
  addPoint(event.clientX, event.clientY);
});

function drawLine() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    const widthLocation = gl.getUniformLocation(program, 'width');
    gl.uniform1f(widthLocation, lineWidth);
    gl.lineWidth(10);
    gl.drawArrays(gl.LINE_STRIP, 0, points.length / 2);
  }
  