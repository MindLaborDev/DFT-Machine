// #################  SETTINGS  #################
let   VELO = 0.01,
      SCALE = 30.0,
      drawData = false,
      customMode = false;
// #################  SETTINGS  #################

let vertices = [];
let renderer;
let font;

function preload() {
  font = loadFont("Quicksand.ttf");
}

function setup() {
  createCanvas(800, 800);
  frameRate(35);
  
  // Render fourier text
  const points = font.textToPoints("Fourier", -width/2 + 50, -height/2 + 420, 192, {
    sampleFactor: 0.6
  });
  vertices = points.map(p => new Complex(p.x / SCALE, p.y / SCALE));
  //print("Vertices: ", vertices.length);
  
  // Calc DFT and initiate animation
  renderer = new Renderer(DFT(), vertices);
  renderer.buildEpicycles(vertices.length);
  vertices = [];
}

function draw() {
  background(51);
  translate(width / 2, height / 2);
  
  if (renderer) {
    renderer.render();
  }
}

function mouseClicked() {
  const x = (mouseX - width/2) / SCALE;
  const y = (mouseY - height/2) / SCALE;
  vertices.push(new Complex(x, y));
  
  renderer = new Renderer(DFT(), vertices);
  renderer.buildEpicycles(vertices.length);
  if (!customMode) {
    VELO = 0.05;
    drawData = true;
    customMode = true;
  }
}

/*
* ###################################################################
* Discrete Fourier Trasformation (DFT) Algorithm
* 1/2𝜋∫ 𝑓(𝑡)𝑒⁻ⁿⁱᵗ𝑑𝑡=𝑐ₙ
*/
function DFT() {
  let func = [];
  for (const n in vertices) {
    let sigma = new Complex(0, 0);
    for (const t in vertices) {
      let unitVector = new Complex(0, 1);
      unitVector = unitVector.scale(-2 * PI * (n-floor(vertices.length/2)) * (t/vertices.length));
      unitVector = unitVector.cexp();
      unitVector = unitVector.mul(vertices[t]);
      unitVector = unitVector.scale(1/vertices.length);
      sigma = sigma.add(unitVector);
    }
    func.push(sigma);
  }
  return func;
}
/*
* ##############################################################
*/
