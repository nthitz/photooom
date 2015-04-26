var img = new Image()
img.onload = imageLoaded;
img.src="computerPhoto3.jpg"
var canvas = document.getElementById('canvas');
var ctxt = canvas.getContext('2d');

window.onmousemove = mousemove;
window.onresize = resize;

function imageLoaded() {
  // document.body.appendChild(img);
  resize();
  d3.timer(animate);

}
var photoW = 1440;
var photoH = 900;
var aspectRatio = photoW / photoH;
var width = window.innerWidth;
var height = window.innerHeight;
var easing = d3.ease('cubic-in-out')
var frames = 50;
var globalTicker = 0;

var rotationAmountDegrees = 6.4;
var rotationAmount = Math.PI * rotationAmountDegrees / 180;



var translateXScale = d3.scale.linear()
var translateYScale = d3.scale.linear()

var scaleXScale = d3.scale.linear()
var scaleYScale = d3.scale.linear()

var rotationScale = d3.scale.linear().range([0, rotationAmount]);

var mouse = [0,0]
var fromMouse = false;


function mousemove(e) {
  mouse[0] = e.clientX;
  mouse[1] = e.clientY;
}
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  var curAspect = width / height;
  if(curAspect > aspectRatio) {
    //fit to height
    width = aspectRatio * height;
  } else if(curAspect < aspectRatio) {
    //fit to width
    height = 1 / aspectRatio  * width;
  }
  canvas.width = width;
  canvas.height = height;

  // set scales

  var zoomedInWidth = width * 0.456;
  var zoomedInHeight = height* 0.46;
  // var zoomedInHeight = 1 / aspectRatio* zoomedInWidth;

  var translateX = width * 0.36;
  var translateY = height * 0.21

  var zoomInAmountX = width / zoomedInWidth;
  var zoomInAmountY = height / zoomedInHeight;

  var translateXAmount = zoomInAmountX * translateX;
  var translateYAmount = zoomInAmountY * translateY;

  translateXScale.range([0, -translateXAmount])
  translateYScale.range([0, -translateYAmount])

  scaleXScale.range([1, zoomInAmountX])
  scaleYScale.range([1, zoomInAmountY])


}
function animate() {
  ctxt.clearRect(0,0, width, height);
  ctxt.globalCompositeOperation = "multiply"
  var globalPct = globalTicker / frames;
  if(fromMouse) {
    globalPct = mouse[0] / (window.outerWidth - 100);
    while(globalPct > 1) { globalPct -= 1}
  }
  globalPct = easing(globalPct)
  var ticker = globalPct * frames;
  var iterations = 8
  for(var i = 0; i < iterations; i++) {
    ctxt.save();
    var pct = (ticker + ((i - ~~(iterations / 2)) * 1.5)) / frames;
    while(pct > 1) { pct -= 1}
    while(pct < 0) { pct += 1}
    ctxt.globalAlpha = 0.1
    ctxt.translate(
      translateXScale(pct), translateYScale(pct)
    )
    ctxt.scale(scaleXScale(pct), scaleYScale(pct))
    ctxt.translate(width/2, height/2)
    ctxt.rotate(rotationScale(pct))
    ctxt.drawImage(img, -width/2,-height/2, width, height);


    ctxt.restore();
  }

  globalTicker += 1;
  if(globalTicker > frames) {
    globalTicker = 0;
  }
}