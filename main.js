let backgroundCanvas = document.getElementById("background");
let backgroundCtx = backgroundCanvas.getContext("2d");

let canvas = document.getElementById("canvas1");
let ctx = canvas.getContext("2d");
ctx.globalAlpha = 0;

document.body.setAttribute("onresize","resizeCanvas()");

download_img = function(el) {
  // var image = canvas.toDataURL("image/png");
  el.href = canvas.toDataURL("image/png");
  el.download = "mypainting.png"
};

////////////////////////////////////////////////////////

let width = window.innerWidth;
let height = window.innerHeight;
let halfWidth = Math.floor(width / 2);
let halfHeight = Math.floor(height / 2);
var viewportWidth = window.innerWidth;
var viewportHeight = window.innerHeight;
let wide = width > height ? true : false;

let colorTheta = 1530;
let index = 0;
let inc = 79717;
let inc2 = 79717;
let zoom = 1;
var changed = true;
var backgroundChanged = true;

let x,y,r;
let scale = wide ? halfHeight/8 : halfWidth/8;
var a=2,b=7,c=929;
var a2=2,b2=7,c2=929;

let backgroundInterval = null;
let parainterval = null;

let palette = [];
buildPalette();

let backgroundType = "colored";  // "colored", "black", "white"
let compositeType = "screen"; // "lighten", "difference", "screen"

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

  changed = true;
  backgroundChanged = true;

  setBackground();
  setCanvas();
  refreshImages();
}

////////////////////////////////////////////////////////

function setBackground(){
  backgroundCanvas.width = width;
  backgroundCanvas.height = height;
  backgroundCanvas.style.width = width;
  backgroundCanvas.style.height = height;
  backgroundCtx.translate(halfWidth,halfHeight);
}

////////////////////////////////////////////////////////

function setCanvas(){
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width;
  canvas.style.height = height;
  ctx.translate(halfWidth, halfHeight);
  clear(ctx);
}

//////////////////////////////////////////////////////////////////////

function refreshImages(){
  parametric(inc);
  if (backgroundChanged) {
    backgroundChanged = false;
    clearInterval(backgroundInterval);
    // console.log("setting background");
    if(backgroundType === "colored"){
      // console.log("setting background colored");
      backgroundInterval = scrollingBackground();
    } else 
    if (backgroundType === "black"){
      // console.log("setting background black");
      backgroundCtx.fillStyle = "#000000";
      backgroundCtx.fillRect(-halfWidth, -halfHeight, width, height);
    } else
    if (backgroundType === "white"){
      // console.log("setting background white");
      backgroundCtx.fillStyle = "#FFFFFF";
      backgroundCtx.fillRect(-halfWidth, -halfHeight, width, height);
    }
  }
}

//////////////////////////////////////////////////////////////////////

function parametric(inc){
  // ctx.fillStyle = "#FFFFFF";

  var aslider = document.getElementById('aValue');
  var atext = document.getElementById('aText');
  aslider.value = a;
  aslider.oninput = function(){atext.innerText = "Value of A: " + aslider.value; update()}
  atext.innerText = "Value of A: " + aslider.value;

  var bslider = document.getElementById('bValue');
  var btext = document.getElementById('bText');
  bslider.value = b;
  bslider.oninput = function(){btext.innerText = "Value of B: " + bslider.value; update()}
  btext.innerText = "Value of B: " + bslider.value;

  var cslider = document.getElementById('cValue');
  var ctext = document.getElementById('cText');
  cslider.value = c;
  cslider.oninput = function(){ctext.innerText = "Value of C: " + cslider.value; update()}
  ctext.innerText = "Value of C: " + cslider.value;

  var islider = document.getElementById('iValue');
  var itext = document.getElementById('iText');
  islider.value = inc;
  islider.oninput = function(){itext.innerText = "Value of theta step: (" + islider.value + ") " + Math.PI/islider.value; update()}
  itext.innerText = "Value of theta step: (" + islider.value + ") " + Math.PI/islider.value;



  var aslider2 = document.getElementById('aValue2');
  var atext2 = document.getElementById('aText2');
  aslider2.value = a2;
  aslider2.oninput = function(){atext2.innerText = "Value of A: " + aslider2.value; update()}
  atext2.innerText = "Value of A: " + aslider2.value;

  var bslider2 = document.getElementById('bValue2');
  var btext2 = document.getElementById('bText2');
  bslider2.value = b2;
  bslider2.oninput = function(){btext2.innerText = "Value of B: " + bslider2.value; update()}
  btext2.innerText = "Value of B: " + bslider2.value;

  var cslider2 = document.getElementById('cValue2');
  var ctext2 = document.getElementById('cText2');
  cslider2.value = c2;
  cslider2.oninput = function(){ctext2.innerText = "Value of C: " + cslider2.value; update()}
  ctext2.innerText = "Value of C: " + cslider2.value;

  var islider2 = document.getElementById('iValue2');
  var itext2 = document.getElementById('iText2');
  islider2.value = inc2;
  islider2.oninput = function(){itext2.innerText = "Value of theta step: (" + islider2.value + ") " + Math.PI/islider2.value; update()}
  itext2.innerText = "Value of theta step: (" + islider2.value + ") " + Math.PI/islider.value;













  
  var zslider = document.getElementById('zValue');
  var ztext = document.getElementById('zText');
  zslider.value = zoom*10;
  zslider.oninput = function(){ztext.innerText = "Value of zoom: " + zslider.value/10; update()}
  ztext.innerText = "Value of zoom: " + zslider.value/10;

  var coloredRadio = document.getElementById('colored');
  coloredRadio.oninput = function(){console.log("colored radio");backgroundType = "colored"; backgroundChanged=true;refreshImages();}
  var blackRadio = document.getElementById('black');
  blackRadio.oninput = function(){console.log("black radio");backgroundType = "black"; backgroundChanged=true;refreshImages();}
  var whiteRadio = document.getElementById('white');
  whiteRadio.oninput = function(){console.log("white radio");backgroundType = "white"; backgroundChanged=true;refreshImages();}

  function update(){  a=Number(aslider.value); 
                      b=Number(bslider.value); 
                      c=Number(cslider.value); 
                      inc = Number(islider.value);
                      a2=Number(aslider2.value); 
                      b2=Number(bslider2.value); 
                      c2=Number(cslider2.value); 
                      inc2 = Number(islider2.value);
                      zoom = Number(zslider.value/10);
                      changed = true;
                    }


  clearInterval(parainterval);
  parainterval = setInterval( drawParametric, 300);

  function drawParametric(){
    if (!changed) return;

    changed = false;

    ctx.globalCompositeOperation = compositeType;
    ctx.save();
    clear(ctx);

    ctx.scale(zoom,zoom);

    for (let theta = 0; theta <= 2*Math.PI; theta+=Math.PI/inc){
      r = (a+b*Math.sin(c*theta));
      ctx.fillStyle = palette[(Math.abs(Math.round(265*r)+colorTheta)%1530)].color;   
      x = Math.cos(theta)*r*scale;
      y = Math.sin(theta)*r*scale;
      drawPoint(ctx, x, y, 1);
    }


    for (let theta = 0; theta <= 2*Math.PI; theta+=Math.PI/inc2){
      r = (a2+b2*Math.sin(c2*theta));
      ctx.fillStyle = palette[(Math.abs(Math.round(265*r)+colorTheta)%1530)].color;   
      x = Math.cos(theta)*r*scale;
      y = Math.sin(theta)*r*scale;
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
// Utility Functions
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

//////////////////////////////////////////////////////////////////////
// Palette Functions
//////////////////////////////////////////////////////////////////////

// index:   into color palette
// percent: -1 = black bias, 0 = actual, 1 = white bias
function getColor(index, percent = 0){   
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

  let interval = setInterval(scrollColors, 20, backgroundCtx, -.75);
  return interval;

  function scrollColors(ctx, percent){
    bColor1 = getColor( index%1530, percent);
    bColor3 = getColor( (index+510)%1530, percent);
    bColor5 = getColor( (index+1020)%1530, percent);

    let gradient = ctx.createRadialGradient(0,0,width/20, 0,0,width/1.5);

    // Add three color stops
    gradient.addColorStop(0,  bColor1);
    gradient.addColorStop(.5, bColor3);
    gradient.addColorStop(1, bColor5);

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