let background = document.getElementById("background");
let backCtx = background.getContext("2d");

let canvas = document.getElementById("canvas1");
let ctx = canvas.getContext("2d");

document.body.setAttribute("onresize","resizeCanvas()");

////////////////////////////////////////////////////////

// let width = 1200;
// let height = 800;
let width = window.innerWidth;
let height = window.innerHeight;
let halfWidth = Math.floor(width / 2);
let halfHeight = Math.floor(height / 2);
var viewportWidth = window.innerWidth;
var viewportHeight = window.innerHeight;
let wide = width > height ? true : false;

let colorTheta = 1530;
let index = 0;
let inc = 10000;
let zoom = 1;

let x,y,r;
let scale = halfWidth/6;
var a=2,b=2,c=640;

// let x, y, j;


let backgroundInterval = null;
let parainterval = null;

let palette = [];
buildPalette();

let showBackground = true;
let showTrig = false;
let showCircles = false;
let showCircles2 = false;
let showCircles3 = false;
let showKoch = false;
let showParametric = true;

resizeCanvas();

////////////////////////////////////////////////////////

function resizeCanvas(){
  width = window.innerWidth;
  height = window.innerHeight;
  halfWidth = Math.floor(width / 2);
  halfHeight = Math.floor(height / 2);
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;  
  
  wide = width > height ? true : false;

  setBackground();
  setCanvas();
  refreshImages();
}

////////////////////////////////////////////////////////

function setBackground(){
  background.width = width;
  background.height = height;
  background.style.width = width;
  background.style.height = height;
  background.style.left = `${viewportWidth/2 - halfWidth}px`;
  background.style.top = `${viewportHeight/2 - halfHeight}px`;


  backCtx.translate(halfWidth,halfHeight);

  backCtx.fillStyle = "#000000";
  backCtx.fillRect(-halfWidth,-halfHeight,width,height);

}
////////////////////////////////////////////////////////

function setCanvas(){
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width;
  canvas.style.height = height;
  canvas.style.left = `${viewportWidth/2 - halfWidth}px`;
  canvas.style.top = `${viewportHeight/2 - halfHeight}px`;

  ctx.translate(halfWidth, halfHeight);

  clear(ctx);
}
//////////////////////////////////////////////////////////////////////



function refreshImages(){
  if (showParametric) parametric(inc);
  if (showBackground) {
    clearInterval(backgroundInterval);
    backgroundInterval = scrollingBackground();
  }
  if (showTrig) trig();
  if (showCircles) circles(0, 0, (width-1)/4, 5);
  if (showCircles2) circles2(0, 0, (width-1)/5, 7, null);
  if (showCircles3) circles3(0, 0, (width - 1) / 6, 7, null);
  if (showKoch) koch();
}

//////////////////////////////////////////////////////////////////////

function trig() {
  ctx.shadowColor = "rgba(20,20,20,.2)";
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 1;

  ctx.fillStyle = "#FFFFFF";
  drawText(ctx, 5, -6, "(0,0)", "12px serif");

  for (let x = -Math.PI; x < Math.PI; x += 0.001) {
    let j = width / (2 * Math.PI);

    ctx.fillStyle = "#FFFFFF";
    drawPoint(ctx, x * j * 4, 0);
    drawPoint(ctx, 0, x * j * 4);

    ctx.fillStyle = "#0000FF";
    let y = Math.sin(x * 3);
    drawPoint(ctx, x * j, (y * halfHeight) / 3);

    ctx.fillStyle = "#00FF00";
    y = Math.cos(x * 3);
    drawPoint(ctx, x * j, (y * halfHeight) / 3);
  }
}

//////////////////////////////////////////////////////////////////////

function circles(x, y, r, i) {
  drawCircle(ctx, x, y, r, "magenta");

  if (i === 0) return;

  circles(x - r, y, r / 2, i - 1);
  circles(x + r, y, r / 2, i - 1);
  circles(x, y + r, r / 2, i - 1);
  circles(x, y - r, r / 2, i - 1);
}

//////////////////////////////////////////////////////////////////////

function circles2(x, y, r, i, dir) {
  drawCircle(ctx, x, y, r, "red");

  if (i === 0) return;

  if (dir != "r") circles2(x - r - r / 2, y, r / 2, i - 1, "r");
  if (dir != "l") circles2(x + r + r / 2, y, r / 2, i - 1, "l");
  if (dir != "t") circles2(x, y + r + r / 2, r / 2, i - 1, "t");
  if (dir != "b") circles2(x, y - r - r / 2, r / 2, i - 1, "b");
}

//////////////////////////////////////////////////////////////////////

function circles3(x, y, r, i, dir) {
  drawCircle(ctx, x, y, r, `#${i + 2}${i + 2}${i + 2}${i + 2}FF`);

  if (i === 0) return;

  if (dir != "l") circles3(x - r - r / 2, y, r / 2, i - 1, "r");
  if (dir != "r") circles3(x + r + r / 2, y, r / 2, i - 1, "l");
  if (dir != "b") circles3(x, y + r + r / 2, r / 2, i - 1, "t");
  if (dir != "t") circles3(x, y - r - r / 2, r / 2, i - 1, "b");
}

//////////////////////////////////////////////////////////////////////

function koch() {
  ctx.strokeStyle = "#99FFFF";

  let w = wide ? height : width;

  for (let r = 2.2; r <= 80; r *= 1.34) {
    let radius = w / r;

    let rad = (90 * Math.PI) / 180;
    let x1 = Math.cos(rad) * radius;
    let y1 = Math.sin(rad) * radius;

    rad = (210 * Math.PI) / 180;
    let x2 = Math.cos(rad) * radius;
    let y2 = Math.sin(rad) * radius;

    rad = (330 * Math.PI) / 180;
    let x3 = Math.cos(rad) * radius;
    let y3 = Math.sin(rad) * radius;

    kochCurve(x1, y1, x2, y2, 5);
    kochCurve(x2, y2, x3, y3, 5);
    kochCurve(x3, y3, x1, y1, 5);
  }
}

function kochCurve(p1x, p1y, p2x, p2y, i) {
  let p3x, p4x, p5x;
  let p3y, p4y, p5y;

  let theta = Math.PI / 3;

  if (i > 0) {
    p3x = (2 * p1x + p2x) / 3;
    p3y = (2 * p1y + p2y) / 3;

    p5x = (2 * p2x + p1x) / 3;
    p5y = (2 * p2y + p1y) / 3;

    p4x = p3x + (p5x - p3x) * Math.cos(theta) + (p5y - p3y) * Math.sin(theta);
    p4y = p3y - (p5x - p3x) * Math.sin(theta) + (p5y - p3y) * Math.cos(theta);

    kochCurve(p1x, p1y, p3x, p3y, i - 1);
    kochCurve(p3x, p3y, p4x, p4y, i - 1);
    kochCurve(p4x, p4y, p5x, p5y, i - 1);
    kochCurve(p5x, p5y, p2x, p2y, i - 1);
  } else {
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();
  }
}

//////////////////////////////////////////////////////////////////////

// parametric(inc);

function parametric(inc){
  ctx.fillStyle = "#FFFFFF";
  // let x,y,r;
  // let scale = halfWidth/6;
  // var a=2,b=2,c=640;
    
  // var formulatext = document.createElement('label');
  // formulatext.innerText = "r = A + B * cos(C * theta)";
  // document.getElementById('form').appendChild(formulatext);

  var aslider = document.getElementById('aValue');
  var atext = document.getElementById('aText');
  // aslider.id = "aValue";
  // aslider.type = 'range';
  // aslider.min = 0;
  // aslider.max = 10;
  aslider.value = a;
  // aslider.step = 1;
  aslider.oninput = function(){atext.innerText = "Value of A: " + aslider.value; update()}
  // document.getElementById('form').appendChild(aslider);
  atext.innerText = "Value of A: " + aslider.value;
  // var atext = document.createElement('label');
  // atext.innerText = "Value of A: "+a;
  // document.getElementById('form').appendChild(atext);

  var bslider = document.getElementById('bValue');
  var btext = document.getElementById('bText');
  // bslider.id = "bValue";
  // bslider.type = 'range';
  // bslider.min = 0;
  // bslider.max = 10;
  bslider.value = b;
  // bslider.step = 1;
  bslider.oninput = function(){btext.innerText = "Value of B: " + bslider.value; update()}
  // document.getElementById('form').appendChild(bslider);
  btext.innerText = "Value of B: " + bslider.value;
  // var btext = document.createElement('label');
  // btext.innerText = "Value of B: "+b;
  // document.getElementById('form').appendChild(btext);

  var cslider = document.getElementById('cValue');
  var ctext = document.getElementById('cText');
  // cslider.id = "cValue";
  // cslider.type = 'range';
  // cslider.min = 1;
  // cslider.max = 1000;
  cslider.value = c;
  // cslider.step = 1;
  cslider.oninput = function(){ctext.innerText = "Value of C: " + cslider.value; update()}
  // document.getElementById('form').appendChild(cslider);
  ctext.innerText = "Value of C: " + cslider.value;
  // var ctext = document.createElement('label');
  // ctext.innerText = "Value of C: "+c;
  // document.getElementById('form').appendChild(ctext);

  var islider = document.getElementById('iValue');
  var itext = document.getElementById('iText');
  // islider.id = "iValue";
  // islider.type = 'range';
  // islider.min = 100;
  // islider.max = 100000;
  islider.value = inc;
  // islider.step = 1;
  islider.oninput = function(){itext.innerText = "Value of theta step: (" + islider.value + ") " + Math.PI/islider.value; update()}
  // document.getElementById('form').appendChild(islider);
  itext.innerText = "Value of theta step: (" + islider.value + ") " + Math.PI/islider.value;
  // var itext = document.createElement('label');
  // itext.innerText = "Value of theta step: "+Math.PI/islider.value;
  // document.getElementById('form').appendChild(itext);

  var zslider = document.getElementById('zValue');
  var ztext = document.getElementById('zText');
  // zslider.id = "zValue";
  // zslider.type = 'range';
  // zslider.min = 1;
  // zslider.max = 100;
  zslider.value = zoom*10;
  // zslider.step = 1;
  zslider.oninput = function(){ztext.innerText = "Value of zoom: " + zslider.value/10; update()}
  // document.getElementById('form').appendChild(zslider);
  ztext.innerText = "Value of zoom: " + zslider.value/10;
  // var ztext = document.createElement('label');
  // ztext.innerText = "Value of zoom: "+zoom;
  // document.getElementById('form').appendChild(ztext);


  function update(){  a=Number(aslider.value); 
                      b=Number(bslider.value); 
                      c=Number(cslider.value); 
                      inc = Number(islider.value);
                      zoom = Number(zslider.value/10);
                      // drawParametric(a,b,c); 
                    }


  clearInterval(parainterval);
  parainterval = setInterval( drawParametric, 100);

  function drawParametric(){
    clear(ctx);
    ctx.save();

    ctx.scale(zoom,zoom);
    // console.log("a",a);
    // console.log("b",b);
    // console.log("c",c);


    for (let theta = 0; theta <= 2*Math.PI; theta+=Math.PI/inc){
      r = (a+b*Math.sin(c*theta));
      ctx.fillStyle = 'red';
      // console.log("r",r)
      // console.log("palette", palette)
      ctx.fillStyle = palette[(Math.abs(Math.round(265*r)+colorTheta)%1530)].color;
      x = Math.cos(theta+Math.PI/4)*r*scale;
      y = Math.sin(theta+Math.PI/4)*r*scale;
      drawPoint(ctx, x, y, 1);
    }

    ctx.restore();

    colorTheta-=2;
    if (colorTheta < 0) colorTheta = 1530;
  }

}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

function drawCircle(ctx, cx, cy, radius, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx, cy, radius, radius, 0, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawPoint(ctx, x, y, width=1) {
  ctx.fillRect(x-width/2, y-width/2, width, width);
}

function drawCenteredText(ctx, x, y, txt, font) {
  ctx.textAlign = "center";
  ctx.font = font;
  ctx.fillText(txt, x, y);
}

function drawText(ctx, x, y, txt, font) {
  ctx.textAlign = "left";
  ctx.font = font;
  ctx.fillText(txt, x, y);
}

function clear(ctx) {
  ctx.clearRect(-halfWidth, -halfHeight, width, height);
}

// index:   into color palette
// percent: -1 = black bias, 0 = actual, 1 = white bias
function getColor(index, percent){   
  let color = palette[index%1530].color;
  let newColor = shadeRGBColor(color, percent); 
  return newColor;
}

// color:   rgb color 
// percent: -1 = black bias, 0 = actual, 1 = white bias
function shadeRGBColor(color, percent) {
  let f=color.split(","),
      t=percent<0?0:255,
      p=percent<0?percent*-1:percent,
      R=parseInt(f[0].slice(4)),
      G=parseInt(f[1]),
      B=parseInt(f[2]);

  return "rgb("+(Math.round((t-R)*p)+R)+","+
                (Math.round((t-G)*p)+G)+","+
                (Math.round((t-B)*p)+B)+")";
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function buildPalette(){
  let r=255, g=0, b=0;

  for (g=0; g<=255; g++){ palette.push({r,g,b,color:`rgb(${r},${g},${b})`});}
  g--;

  for (r=254; r>=0; r--){ palette.push({r,g,b,color:`rgb(${r},${g},${b})`});}
  r++;

  for (b=1; b<=255; b++){ palette.push({r,g,b,color:`rgb(${r},${g},${b})`});}
  b--;

  for (g=254; g>=0; g--){ palette.push({r,g,b,color:`rgb(${r},${g},${b})`});}
  g++;

  for (r=1; r<=255; r++){ palette.push({r,g,b,color:`rgb(${r},${g},${b})`});}
  r--;

  for (b=254; b>0; b--){ palette.push({r,g,b,color:`rgb(${r},${g},${b})`});}
  b++;

  // console.log(palette);
}

////////////////////////////////////////////////////////

function scrollingBackground(){

  let interval = setInterval(scrollColors, 20, backCtx, -.75);
  return interval;

  function scrollColors(ctx, percent){
    bColor1 = getColor( index%1530, percent);
    // bColor2 = getColor( (index+255)%1530, percent);
    bColor3 = getColor( (index+510)%1530, percent);
    // bColor4 = getColor( (index+765)%1530, percent);
    bColor5 = getColor( (index+1020)%1530, percent);
    // bColor6 = getColor( (index+1275)%1530, percent);

    let gradient = ctx.createRadialGradient(0,0,width/20, 0,0,width/1.5);

    // Add three color stops
    gradient.addColorStop(0,  bColor1);
    // gradient.addColorStop(.2, bColor2);
    gradient.addColorStop(.5, bColor3);
    // gradient.addColorStop(.6, bColor4);
    gradient.addColorStop(1, bColor5);
    // gradient.addColorStop(1,  bColor6);

    ctx.fillStyle = gradient;
    ctx.fillRect(-halfWidth, -halfHeight, width, height);

    index+=2;
    index = index%1530;
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