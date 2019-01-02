let backgroundCanvas = document.querySelector('#background');
let backgroundCtx = backgroundCanvas.getContext('2d');

let canvas = document.querySelector('#canvas1');
let ctx = canvas.getContext('2d');
ctx.globalAlpha = 0;

document.body.setAttribute('onresize', 'resizeCanvas()');

window.addEventListener('keydown',
  function (e) { 
    if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) { 
      if (e.target.nodeName == 'INPUT' && e.target.type == 'number') { 
        e.preventDefault(); 
        return false; 
      } 
    } 
  }, true);

download_img = function (dlLink) {
  dlLink.href = canvas.toDataURL('image/png');
  dlLink.download = 'mypainting.png'
};

////////////////////////////////////////////////////////

let width = window.innerWidth;
let height = window.innerHeight;
let halfWidth = Math.floor(width / 2);
let halfHeight = Math.floor(height / 2);
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
let wide = width > height ? true : false;

let colorTheta = 1530;
let index = 0;
let inc = inc2 = 1000;
let rot = rot2 = 0
let zoom = 1;
let changed = true;
let backgroundChanged = true;

let x, y, r;
let scale = wide ? halfHeight / 8 : halfWidth / 8;
let a = 2, b = 4, c = 6;
let a2 = 5, b2 = 2.5, c2 = 6;
let leqType = 'eq1';
let reqType = 'eq1';

let backgroundInterval = null;
let parainterval = null;

let palette = [];
buildPalette();

let backgroundType = 'colored';  // 'colored', 'black', 'white'
let compositeType = 'screen'; // 'lighten', 'difference', 'screen'

resizeCanvas();

////////////////////////////////////////////////////////

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  halfWidth = Math.floor(width / 2);
  halfHeight = Math.floor(height / 2);
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;

  wide = width > height ? true : false;

  changed = true;
  backgroundChanged = true;

  setBackground();
  setCanvas();
  refreshImages();
}

////////////////////////////////////////////////////////

function setBackground() {
  backgroundCanvas.width = width;
  backgroundCanvas.height = height;
  backgroundCanvas.style.width = width;
  backgroundCanvas.style.height = height;
  backgroundCtx.translate(halfWidth, halfHeight);
}

////////////////////////////////////////////////////////

function setCanvas() {
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width;
  canvas.style.height = height;
  ctx.translate(halfWidth, halfHeight);
  clear(ctx);
}

//////////////////////////////////////////////////////////////////////

function refreshImages() {
  parametric();
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

function parametric() {
  // r=sin(A*theta)^2+cos(B*theta)^4

  loadState();

  // Equation options
  var leq1 = document.querySelector('#leq1');
  leq1.oninput = function () { leqType = 'eq1'; changed = true; saveState(); refreshImages(); }
  var leq2 = document.querySelector('#leq2');
  leq2.oninput = function () { leqType = 'eq2'; changed = true; saveState(); refreshImages(); }
  var leq3 = document.querySelector('#leq3');
  leq3.oninput = function () { leqType = 'eq3'; changed = true; saveState(); refreshImages(); }

  let neg_r = null;

  // First equation variables
  var aslider = document.querySelector('#aValue');
  var atext = document.querySelector('#aText');

  aslider.value = a;
  aslider.oninput = function () { atext.value = aslider.value; update() }
  atext.value = aslider.value;
  atext.oninput = function () { aslider.value = atext.value; update() }

  var bslider = document.querySelector('#bValue');
  var btext = document.querySelector('#bText');

  bslider.value = b;
  bslider.oninput = function () { btext.value = bslider.value; update() }
  btext.value = bslider.value;
  btext.oninput = function () { bslider.value = btext.value; update() }

  var cslider = document.querySelector('#cValue');
  var ctext = document.querySelector('#cText');

  cslider.value = c;
  cslider.oninput = function () { ctext.value = cslider.value; update() }
  ctext.value = cslider.value;
  ctext.oninput = function () { cslider.value = ctext.value; update() }

  var rslider = document.querySelector('#rValue');
  var rtext = document.querySelector('#rText');

  rslider.value = rot;
  rslider.oninput = function () { rtext.value = rslider.value; update() }
  rtext.value = rslider.value;
  rtext.oninput = function () { rslider.value = rtext.value; update() }



  var islider = document.querySelector('#iValue');
  var itext = document.querySelector('#iText');

  islider.value = inc;
  islider.oninput = function () { itext.value = islider.value; update() }
  itext.value = islider.value;
  itext.oninput = function () { islider.value = itext.value; update() }


  // Equation options
  var req1 = document.querySelector('#req1');
  req1.oninput = function () { reqType = 'eq1'; changed = true; saveState(); refreshImages(); }
  var req2 = document.querySelector('#req2');
  req2.oninput = function () { reqType = 'eq2'; changed = true; saveState(); refreshImages(); }
  var req3 = document.querySelector('#req3');
  req3.oninput = function () { reqType = 'eq3'; changed = true; saveState(); refreshImages(); }


  // Second equation variables
  var aslider2 = document.querySelector('#aValue2');
  var atext2 = document.querySelector('#aText2');

  aslider2.value = a2;
  aslider2.oninput = function () { atext2.value = aslider2.value; update() }
  atext2.value = aslider2.value;
  atext2.oninput = function () { aslider2.value = atext2.value; update() }

  var bslider2 = document.querySelector('#bValue2');
  var btext2 = document.querySelector('#bText2');
  bslider2.value = b2;
  bslider2.oninput = function () { btext2.value = bslider2.value; update() }
  btext2.value = bslider2.value;
  btext2.oninput = function () { bslider2.value = btext2.value; update() }

  var cslider2 = document.querySelector('#cValue2');
  var ctext2 = document.querySelector('#cText2');
  cslider2.value = c2;
  cslider2.oninput = function () { ctext2.value = cslider2.value; update() }
  ctext2.value = cslider2.value;
  ctext2.oninput = function () { cslider2.value = ctext2.value; update() }


  var rslider2 = document.querySelector('#rValue2');
  var rtext2 = document.querySelector('#rText2');

  rslider2.value = rot2;
  rslider2.oninput = function () { rtext2.value = rslider2.value; update() }
  rtext2.value = rslider2.value;
  rtext2.oninput = function () { rslider2.value = rtext2.value; update() }



  var islider2 = document.querySelector('#iValue2');
  var itext2 = document.querySelector('#iText2');
  islider2.value = inc2;
  islider2.oninput = function () { itext2.value = islider2.value; update() }
  itext2.value = islider2.value;
  itext2.oninput = function () { islider2.value = itext2.value; update() }



  // Zoom option
  var zslider = document.querySelector('#zValue');
  var ztext = document.querySelector('#zText');
  zslider.value = zoom * 10;
  zslider.oninput = function () { ztext.innerText = 'Value of zoom: ' + zslider.value / 10; update() }
  ztext.innerText = 'Value of zoom: ' + zslider.value / 10;


  // Background options
  var coloredRadio = document.querySelector('#colored');
  coloredRadio.oninput = function () { backgroundType = 'colored'; backgroundChanged = true; refreshImages(); }
  var blackRadio = document.querySelector('#black');
  blackRadio.oninput = function () { backgroundType = 'black'; backgroundChanged = true; refreshImages(); }
  var whiteRadio = document.querySelector('#white');
  whiteRadio.oninput = function () { backgroundType = 'white'; backgroundChanged = true; refreshImages(); }

  function loadState(){
    let leftEq=localStorage.getItem('leftEq');
    if (leftEq){
      leftEq = JSON.parse(leftEq);
    
      console.log(leftEq);

      leqType = leftEq.leqType;
      a = Number(leftEq.a);
      b = Number(leftEq.b);
      c = Number(leftEq.c);
      rot = Number(leftEq.rot);
      inc = Number(leftEq.inc);
      zoom = Number(leftEq.zoom);
    }

    let rightEq=localStorage.getItem('rightEq');
    if (rightEq){
      rightEq = JSON.parse(rightEq);
    
      console.log(rightEq);

      reqType = rightEq.reqType;
      a2 = Number(rightEq.a);
      b2 = Number(rightEq.b);
      c2 = Number(rightEq.c);
      rot2 = Number(rightEq.rot);
      inc2 = Number(rightEq.inc);
    }

  }

  function saveState(){
    localStorage.setItem('leftEq', JSON.stringify({
      leqType : leqType,
      a : aslider.value,
      b : bslider.value,
      c : cslider.value,
      rot : rslider.value,
      inc : islider.value,
      zoom : zslider.value / 10
    }));
  
    localStorage.setItem('rightEq', JSON.stringify({
      reqType : reqType,
      a : aslider2.value,
      b : bslider2.value,
      c : cslider2.value,
      rot : rslider2.value,
      inc : islider2.value,
    }));
  }

  function update() {
    a = Number(aslider.value);
    b = Number(bslider.value);
    c = Number(cslider.value);
    rot = Number(rslider.value);
    inc = Number(islider.value);
    a2 = Number(aslider2.value);
    b2 = Number(bslider2.value);
    c2 = Number(cslider2.value);
    rot2 = Number(rslider2.value);
    inc2 = Number(islider2.value);
    zoom = Number(zslider.value / 10);
    changed = true;
    saveState();
  }


  clearInterval(parainterval);
  parainterval = setInterval(drawParametric, 10);

  function drawParametric() {
    if (!changed) return;

    changed = false;

    ctx.globalCompositeOperation = compositeType;
    ctx.save();
    clear(ctx);

    ctx.scale(zoom, zoom);

    for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / inc) {

      switch (leqType) {
        case 'eq1':
          r = (a + b * Math.sin(c * (theta + rot)));
          break;

        case 'eq2':
          r = a * theta;
          break;

        case 'eq3':
          let sign = a * a * Math.sin(b * theta) < 0 ? -1 : 1;
          r = sign * Math.sqrt(Math.abs(a * a * Math.sin(b * (theta + rot))));
          // r = sign * Math.sqrt(Math.abs(a * a * Math.sin(b * (theta+rot))));
          break;;
        default:
          break;
      }

      ctx.fillStyle = palette[(Math.abs(Math.round(265 * r) + colorTheta) % 1530)].color;
      x = Math.cos(theta) * r * scale;
      y = Math.sin(theta) * r * scale;
      drawPoint(ctx, x, y, 1);
    }


    for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / inc2) {

      switch (reqType) {
        case 'eq1':
          r = (a2 + b2 * Math.sin(c2 * (theta + rot2)));
          neg_r = false;;
          break;
        case 'eq2':
          r = a2 * theta;
          neg_r = false;
          break;
        case 'eq3':
          // let sign = a2 * a2 * Math.sin(b2 * theta) < 0 ? -1 : 1;
          // r = sign * Math.sqrt(Math.abs(a2 * a2 * Math.sin(b2 * theta)));
          // r = sign * Math.sqrt(Math.abs(a2 * a2 * Math.sin(b2 * (theta + rot2))));
          r = Math.sqrt(Math.abs(a2 * a2 * Math.sin(b2 * (theta+rot2))));
          neg_r = true;
          break;

        default:
          break;
      }

      ctx.fillStyle = palette[(Math.abs(Math.round(265 * r) + colorTheta) % 1530)].color;
      x = Math.cos(theta) * r * scale;
      y = Math.sin(theta) * r * scale;
      drawPoint(ctx, x, y, 1);

      if (neg_r) {
        x = -Math.cos(theta) * r * scale;
        y = -Math.sin(theta) * r * scale;
        drawPoint(ctx, x, y, 1);
      }

    }

    ctx.restore();

    colorTheta -= 2;
    if (colorTheta < 0) colorTheta = 1530;
  }


}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

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

// index:   into color palette
// percent: -1 = black bias, 0 = actual, 1 = white bias
function getColor(index, percent = 0) {
  let color = palette[index % 1530].color;
  let newColor = shadeRGBColor(color, percent);
  return newColor;
}

// color:   rgb color 
// percent: -1 = black bias, 0 = actual, 1 = white bias
function shadeRGBColor(color, percent) {
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

function buildPalette() {
  let r = 255, g = 0, b = 0;

  for (g = 0; g <= 255; g++) { addToPalette(r,g,b); }
  g--;

  for (r = 254; r >= 0; r--) { addToPalette(r,g,b); }
  r++;

  for (b = 1; b <= 255; b++) { addToPalette(r,g,b); }
  b--;

  for (g = 254; g >= 0; g--) { addToPalette(r,g,b); }
  g++;

  for (r = 1; r <= 255; r++) { addToPalette(r,g,b); }
  r--;

  for (b = 254; b > 0; b--) { addToPalette(r,g,b); }
  b++;

  function addToPalette(r,g,b){
    palette.push({ r, g, b, color: `rgb(${r},${g},${b})` });
  }

  // console.log(palette);
}

////////////////////////////////////////////////////////

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