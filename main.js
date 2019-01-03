document.body.setAttribute('onresize', 'resizeCanvas()');

window.addEventListener('keydown',
  function (e) {
    if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
      if (e.target.nodeName == 'INPUT' && e.target.type == 'number') {
        e.preventDefault();
        return false;
      }
    }
  },
  true);

function downloadImage(dlLink) {
  dlLink.href = canvas.toDataURL('image/png');
  dlLink.download = 'mypainting.png'
};

////////////////////////////////////////////////////////
// Find HTML Elements

let backgroundCanvas = document.querySelector('#background');
let backgroundCtx = backgroundCanvas.getContext('2d');

let canvas = document.querySelector('#canvas1');
let ctx = canvas.getContext('2d');
ctx.globalAlpha = 0;
ctx.globalCompositeOperation = 'screen';

let lEq1 = document.querySelector('#lEq1');
let lEq2 = document.querySelector('#lEq2');
let lEq3 = document.querySelector('#lEq3');

let lEqlabel = document.querySelector("#lEqlabel");

let aSlider = document.querySelector('#aValue');
let aText = document.querySelector('#aText');

let bSlider = document.querySelector('#bValue');
let bText = document.querySelector('#bText');

let cSlider = document.querySelector('#cValue');
let cText = document.querySelector('#cText');

let rSlider = document.querySelector('#rValue');
let rText = document.querySelector('#rText');

let iSlider = document.querySelector('#iValue');
let iText = document.querySelector('#iText');


let rEq1 = document.querySelector('#rEq1');
let rEq2 = document.querySelector('#rEq2');
let rEq3 = document.querySelector('#rEq3');

let rEqlabel = document.querySelector("#rEqlabel");

let aSlider2 = document.querySelector('#aValue2');
let aText2 = document.querySelector('#aText2');

let bSlider2 = document.querySelector('#bValue2');
let bText2 = document.querySelector('#bText2');

let cSlider2 = document.querySelector('#cValue2');
let cText2 = document.querySelector('#cText2');

let rSlider2 = document.querySelector('#rValue2');
let rText2 = document.querySelector('#rText2');

let iSlider2 = document.querySelector('#iValue2');
let iText2 = document.querySelector('#iText2');

let zslider = document.querySelector('#zValue');
let ztext = document.querySelector('#zText');

let coloredRadio = document.querySelector('#colored');
let blackRadio = document.querySelector('#black');
let whiteRadio = document.querySelector('#white');

////////////////////////////////////////////////////////
// Set Initial Values

let width = window.innerWidth;
let height = window.innerHeight;
let halfWidth = Math.floor(width / 2);
let halfHeight = Math.floor(height / 2);
// let wide = width > height ? true : false;
let wide = width > height;

let colorTheta = 1530;
let index = 0;
let inc = inc2 = 1000;
let rot = rot2 = 0
let zoom = 1;
let rChanged = lChanged = true;
let backgroundChanged = true;

let x, y, r;
let scale = wide ? halfHeight / 8 : halfWidth / 8;
let a = 2,
    b = 4,
    c = 6;
let a2 = 5,
    b2 = 2.5,
    c2 = 6;
let lEqType = 'Eq1';
let rEqType = 'Eq1';
let neg_r = null;

let backgroundInterval = null;
let backgroundType = 'black'; // 'colored', 'black', 'white'

let palette = [];

////////////////////////////////////////////////////////
// Call starting routines

buildPalette();
loadState();
setInputs();
setEqLabel();
resizeCanvas();

////////////////////////////////////////////////////////
// Initialize HTML elements with events and values

function setInputs() {
  // Left equation options
  lEq1.oninput = function () {
    lEqType = 'Eq1';
    lChanged = true;
    setEqLabel();
    saveState();
    refreshImages();
  }
  lEq2.oninput = function () {
    lEqType = 'Eq2';
    lChanged = true;
    setEqLabel();
    saveState();
    refreshImages();
  }
  lEq3.oninput = function () {
    lEqType = 'Eq3';
    lChanged = true;
    setEqLabel();
    saveState();
    refreshImages();
  }

  document.getElementById('l' + lEqType).checked = true;

  // Left equation variables
  aSlider.oninput = function () {
    aText.value = aSlider.value;
    update()
  }
  aText.oninput = function () {
    aSlider.value = aText.value;
    update()
  }
  aText.value = aSlider.value = a;

  bSlider.oninput = function () {
    bText.value = bSlider.value;
    update()
  }
  bText.oninput = function () {
    bSlider.value = bText.value;
    update()
  }
  bText.value = bSlider.value = b;

  cSlider.oninput = function () {
    cText.value = cSlider.value;
    update()
  }
  cText.oninput = function () {
    cSlider.value = cText.value;
    update()
  }
  cText.value = cSlider.value = c;

  rSlider.oninput = function () {
    rText.value = rSlider.value;
    update()
  }
  rText.oninput = function () {
    rSlider.value = rText.value;
    update()
  }
  rText.value = rSlider.value = rot;

  iSlider.oninput = function () {
    iText.value = iSlider.value;
    update()
  }
  iText.oninput = function () {
    iSlider.value = iText.value;
    update()
  }
  iText.value = iSlider.value = inc;

  document.getElementById(backgroundType).checked = true;

  // Right equation options
  rEq1.oninput = function () {
    rEqType = 'Eq1';
    rChanged = true;
    setEqLabel();
    saveState();
    refreshImages();
  }
  rEq2.oninput = function () {
    rEqType = 'Eq2';
    rChanged = true;
    setEqLabel();
    saveState();
    refreshImages();
  }
  rEq3.oninput = function () {
    rEqType = 'Eq3';
    rChanged = true;
    setEqLabel();
    saveState();
    refreshImages();
  }

  document.getElementById('r' + rEqType).checked = true;

  // Right equation variables
  aSlider2.oninput = function () {
    aText2.value = aSlider2.value;
    update()
  }
  aText2.oninput = function () {
    aSlider2.value = aText2.value;
    update()
  }
  aText2.value = aSlider2.value = a2;

  bSlider2.oninput = function () {
    bText2.value = bSlider2.value;
    update()
  }
  bText2.oninput = function () {
    bSlider2.value = bText2.value;
    update()
  }
  bText2.value = bSlider2.value = b2;

  cSlider2.oninput = function () {
    cText2.value = cSlider2.value;
    update()
  }
  cText2.oninput = function () {
    cSlider2.value = cText2.value;
    update()
  }
  cText2.value = cSlider2.value = c2;

  rSlider2.oninput = function () {
    rText2.value = rSlider2.value;
    update()
  }
  rText2.oninput = function () {
    rSlider2.value = rText2.value;
    update()
  }
  rText2.value = rSlider2.value = rot2;

  iSlider2.oninput = function () {
    iText2.value = iSlider2.value;
    update()
  }
  iText2.oninput = function () {
    iSlider2.value = iText2.value;
    update()
  }
  iText2.value = iSlider2.value = inc2;

  // Zoom options
  zslider.value = zoom * 10;
  zslider.oninput = function () {
    ztext.innerText = 'Value of zoom: ' + zslider.value / 10;
    update()
  }
  ztext.innerText = 'Value of zoom: ' + zslider.value / 10;

  // Background options
  coloredRadio.oninput = function () {
    backgroundType = 'colored';
    backgroundChanged = true;
    saveState();
    refreshImages();
  }

  blackRadio.oninput = function () {
    backgroundType = 'black';
    backgroundChanged = true;
    saveState();
    refreshImages();
  }

  whiteRadio.oninput = function () {
    backgroundType = 'white';
    backgroundChanged = true;
    saveState();
    refreshImages();
  }
}

////////////////////////////////////////////////////////
// Change eq label when new eq is selected

function setEqLabel() {
  switch (lEqType) {
    case 'Eq1':
      lEqlabel.innerHTML = "r = A + B * cos(C * (&theta; + rot))";
      break;
    case 'Eq2':
      lEqlabel.innerHTML = "r = A * &theta;";
      break;
    case 'Eq3':
      lEqlabel.innerHTML = "r = &radic;(A&sup2; * sin(B * (&theta; + rot)))";
      break;

    default:
      break;
  }

  switch (rEqType) {
    case 'Eq1':
      rEqlabel.innerHTML = "r = A<sub>2</sub> + B<sub>2</sub> * cos(C<sub>2</sub> * (&theta;<sub>2</sub> + rot<sub>2</sub>))";
      break;
    case 'Eq2':
      rEqlabel.innerHTML = "r = A<sub>2</sub> * &theta;<sub>2</sub>";
      break;
    case 'Eq3':
      rEqlabel.innerHTML = "r = &radic;(A<sub>2</sub>&sup2; * sin(B<sub>2</sub> * (&theta;<sub>2</sub> + rot<sub>2</sub>)))";
      break;

    default:
      break;
  }
}

////////////////////////////////////////////////////////
// Load previous state from local storage

function loadState() {
  let leftEq = localStorage.getItem('leftEq');
  if (leftEq) {
    leftEq = JSON.parse(leftEq);

    lEqType = leftEq.lEqType;
    a = Number(leftEq.a);
    b = Number(leftEq.b);
    c = Number(leftEq.c);
    rot = Number(leftEq.rot);
    inc = Number(leftEq.inc);
    zoom = Number(leftEq.zoom);
    backgroundType = leftEq.backgroundType;
  }

  let rightEq = localStorage.getItem('rightEq');
  if (rightEq) {
    rightEq = JSON.parse(rightEq);

    rEqType = rightEq.rEqType;
    a2 = Number(rightEq.a);
    b2 = Number(rightEq.b);
    c2 = Number(rightEq.c);
    rot2 = Number(rightEq.rot);
    inc2 = Number(rightEq.inc);
  }
}

////////////////////////////////////////////////////////
// Save current state to local storage

function saveState() {
  localStorage.setItem('leftEq', JSON.stringify({
    lEqType: lEqType,
    a: aSlider.value,
    b: bSlider.value,
    c: cSlider.value,
    rot: rSlider.value,
    inc: iSlider.value,
    zoom: zslider.value / 10,
    backgroundType: backgroundType
  }));

  localStorage.setItem('rightEq', JSON.stringify({
    rEqType: rEqType,
    a: aSlider2.value,
    b: bSlider2.value,
    c: cSlider2.value,
    rot: rSlider2.value,
    inc: iSlider2.value
  }));
}

////////////////////////////////////////////////////////
// Update variable values after a slider change

function update() {
  a = Number(aSlider.value);
  b = Number(bSlider.value);
  c = Number(cSlider.value);
  rot = Number(rSlider.value);
  inc = Number(iSlider.value);
  a2 = Number(aSlider2.value);
  b2 = Number(bSlider2.value);
  c2 = Number(cSlider2.value);
  rot2 = Number(rSlider2.value);
  inc2 = Number(iSlider2.value);
  zoom = Number(zslider.value / 10);
  rChanged = lChanged = true;
  saveState();
  drawParametric();
}

////////////////////////////////////////////////////////
// Resize canvas after window size change

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  halfWidth = Math.floor(width / 2);
  halfHeight = Math.floor(height / 2);

  wide = width > height ? true : false;

  rChanged = lChanged = true;
  backgroundChanged = true;

  canvas.width = backgroundCanvas.width = width;
  canvas.height = backgroundCanvas.height = height;
  canvas.style.width = backgroundCanvas.style.width = width;
  canvas.style.height = backgroundCanvas.style.height = height;
  backgroundCtx.translate(halfWidth, halfHeight);
  ctx.translate(halfWidth, halfHeight);

  refreshImages();
}

//////////////////////////////////////////////////////////////////////

function refreshImages() {
  drawParametric();

  if (backgroundChanged) {
    backgroundChanged = false;
    clearInterval(backgroundInterval);

    switch (backgroundType) {
      case 'colored':
        backgroundInterval = scrollingBackground();
        break;
      case 'black':
        backgroundCtx.fillStyle = '#000000';
        backgroundCtx.fillRect(-halfWidth, -halfHeight, width, height);
        break;
      case 'white':
        backgroundCtx.fillStyle = '#FFFFFF';
        backgroundCtx.fillRect(-halfWidth, -halfHeight, width, height);
        break;

      default:
        backgroundCtx.fillStyle = '#000000';
        backgroundCtx.fillRect(-halfWidth, -halfHeight, width, height);
        break;
    }
  }
}

//////////////////////////////////////////////////////////////////////
// Draws the selected parametric eqs with the current parameters

function drawParametric() {
  if (!rChanged && !lChanged) return;

  rChanged = lChanged = false;

  ctx.globalCompositeOperation = 'screen';
  ctx.save();
  clear(ctx);

  ctx.scale(zoom, zoom);

  // draw left equation
  for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / inc) {

    switch (lEqType) {
      case 'Eq1':
        r = (a + b * Math.sin(c * (theta + rot)));
        neg_r = false;
        break;
      case 'Eq2':
        r = a * theta;
        neg_r = false;
        break;
      case 'Eq3':
        r = Math.sqrt(Math.abs(a * a * Math.sin(b * (theta + rot))));
        neg_r = true;
        break;

      default:
        r = 1;
        break;
    }

    ctx.fillStyle = palette[(Math.abs(Math.round(265 * r) + colorTheta) % 1530)].color;
    x = Math.cos(theta) * r * scale;
    y = Math.sin(theta) * r * scale;
    drawPoint(ctx, x, y, 1);

    if (neg_r) {
      drawPoint(ctx, -x, -y, 1);
    }

  } // end for loop

  // draw right equation
  for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / inc2) {

    switch (rEqType) {
      case 'Eq1':
        r = (a2 + b2 * Math.sin(c2 * (theta + rot2)));
        neg_r = false;
        break;
      case 'Eq2':
        r = a2 * theta;
        neg_r = false;
        break;
      case 'Eq3':
        r = Math.sqrt(Math.abs(a2 * a2 * Math.sin(b2 * (theta + rot2))));
        neg_r = true;
        break;

      default:
        r = 1;
        break;
    }

    ctx.fillStyle = palette[(Math.abs(Math.round(265 * r) + colorTheta) % 1530)].color;
    x = Math.cos(theta) * r * scale;
    y = Math.sin(theta) * r * scale;
    drawPoint(ctx, x, y, 1);

    if (neg_r) {
      drawPoint(ctx, -x, -y, 1);
    }

  } // end for loop

  ctx.restore();
}

//////////////////////////////////////////////////////////////////////
// Utility Functions
//////////////////////////////////////////////////////////////////////

function drawCircle(ctx, cx, cy, radius, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx, cy, radius, radius, 0, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawPoint(ctx, x, y, width = 1) {
  ctx.fillRect(x - width / 2, y - width / 2, width, width);
}

function drawCenteredText(ctx, x, y, txt, font) {
  ctx.textAlign = 'center';
  ctx.font = font;
  ctx.fillText(txt, x, y);
}

function drawText(ctx, x, y, txt, font) {
  ctx.textAlign = 'left';
  ctx.font = font;
  ctx.fillText(txt, x, y);
}

function clear(ctx) {
  ctx.clearRect(-halfWidth, -halfHeight, width, height);
}

//////////////////////////////////////////////////////////////////////
// Palette Functions
//////////////////////////////////////////////////////////////////////

// index:   into color palette array[1530]
// percent: -1 = black bias, 0 = actual, 1 = white bias
function getColor(index, percent = 0) {
  let color = palette[index % 1530].color;
  let newColor = shadeRGBColor(color, percent);
  return newColor;
}

// color:   rgb color 
// percent: -1 = black bias, 0 = actual, 1 = white bias
function shadeRGBColor(color, percent = 0) {
  let f = color.split(','),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = parseInt(f[0].slice(4)),
      G = parseInt(f[1]),
      B = parseInt(f[2]);

  return 'rgb(' + (Math.round((t - R) * p) + R) + ',' +
    (Math.round((t - G) * p) + G) + ',' +
    (Math.round((t - B) * p) + B) + ')';
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
    throw 'Invalid color component';
  return ((r << 16) | (g << 8) | b).toString(16);
}

// Builds a palette array[1530] of palette objects
function buildPalette() {
  let r = 255,
      g = 0,
      b = 0;

  for (g = 0; g <= 255; g++) {
    addToPalette(r, g, b);
  }
  g--;

  for (r = 254; r >= 0; r--) {
    addToPalette(r, g, b);
  }
  r++;

  for (b = 1; b <= 255; b++) {
    addToPalette(r, g, b);
  }
  b--;

  for (g = 254; g >= 0; g--) {
    addToPalette(r, g, b);
  }
  g++;

  for (r = 1; r <= 255; r++) {
    addToPalette(r, g, b);
  }
  r--;

  for (b = 254; b > 0; b--) {
    addToPalette(r, g, b);
  }
  b++;

  function addToPalette(r, g, b) {
    palette.push({
      r,
      g,
      b,
      color: `rgb(${r},${g},${b})`
    });
  }

  // console.log(palette);
}

// Sets an interval to scroll colored background
function scrollingBackground() {

  let interval = setInterval(scrollColors, 20, backgroundCtx, -.55);
  return interval;

  function scrollColors(ctx, percent) {
    bColor1 = getColor(index % 1530, percent);
    bColor3 = getColor((index + 510) % 1530, percent);
    bColor5 = getColor((index + 1020) % 1530, percent);

    let gradient = ctx.createRadialGradient(0, 0, width / 20, 0, 0, width / 1.5);

    // Add three color stops
    gradient.addColorStop(0, bColor1);
    gradient.addColorStop(.5, bColor3);
    gradient.addColorStop(1, bColor5);

    ctx.fillStyle = gradient;
    ctx.fillRect(-halfWidth, -halfHeight, width, height);

    index += 2;
    index = index % 1530;
  }
}

///////////////////////////
// Canvas 2D Properties
///////////////////////////

// canvas
// fillStyle **
// font **
// globalAlpha
// globalCompositeOperation
// lineCap
// lineDashOffset
// lineJoin
// lineWidth
// miterLimit
// shadowBlur **
// shadowColor **
// shadowOffsetX **
// shadowOffsetY **
// strokeStyle **
// textAlign **
// textBaseline

///////////////////////////
// Canvas 2D Methods
///////////////////////////

// arc()
// arcTo()
// beginPath() **
// bezierCurveTo()
// clearRect() **
// clip()
// closePath()
// createImageData()
// createLinearGradient()
// createPattern()
// createRadialGradient() **
// drawFocusIfNeeded()
// drawImage()
// ellipse() **
// fill()
// fillRect() **
// fillText() **
// getImageData()
// getLineDash()
// isPointInPath()
// isPointInStroke()
// lineTo() **
// measureText()
// moveTo() **
// putImageData()
// quadraticCurveTo()
// rect()
// restore() **
// rotate()
// save() **
// scale() **
// setLineDash()
// setTransform()
// stroke() **
// strokeRect()
// strokeText()
// transform()
// translate() **