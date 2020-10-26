Bangle.setLCDPower(1);
Bangle.setLCDTimeout(0);
Bangle.setLCDMode("doublebuffered")
Bangle.ioWr(0x80,0)
x=0;
var min=0,max=0;
var wasHigh = 0, wasLow = 0;
var lastHigh = getTime();
var hrmList = [];
var hrm;

function readHRM() {
  var a = analogRead(D29);
  var h = getTime();
  min=Math.min(min*0.97+a*0.03,a);
  max=Math.max(max*0.97+a*0.03,a);
  if ((max-min)>0.005) {
    if (4*a > (min+3*max)) { // high
      if (!wasHigh && wasLow) {
        var currentHrm = 60/(h-lastHigh);
        lastHigh = h;
        if (currentHrm<250) {
          while (hrmList.length>12) hrmList.shift();
          hrmList.push(currentHrm);
          // median filter
          var t = hrmList.slice(); // copy
          t.sort();
          // average the middle 3
          var mid = t.length>>1;
          if (mid+2<t.length)
            hrm = (t[mid]+t[mid+1]+t[mid+2])/3;
          else if (mid<t.length)
            hrm = t[mid];
          else
            hrm = 0;
          g.setClipRect(0,101,239,160);
          g.clearRect(0,101,239,160);
          g.setFontVector(40);
          g.setFontAlign(0,0);
          var str = hrm ? Math.round(hrm) : "?";
          var px = 120;
          g.drawString(str,px,120);
          px += g.stringWidth(str)/2;
          g.drawString("BPM",px+20,140);
        }
      }
      wasLow = 0;
      wasHigh = 1;
    } else if (4*a < (max+3*min)) { // low
      wasLow = 1;
    } else { // middle
      wasHigh = 0;
    }
  }
  g.setClipRect(0,0,239,100);
  g.clearRect(0,0,239,100);
  d = beatCount++%2==1?1+.1:1;
  drawPolyImage(eval(require("Storage").read("heart-beat.svg")),g.getWidth()/2-25,30,{scale:d});
  g.flip();
}
function drawPolyImage(polys, x, y, options) {
  const o = options || {};
  const g = o.graphics || global.g;
  const a = o.rotate || 0;
  const s = o.scale != null ? o.scale : 1;
  const ca = Math.cos(a), sa = Math.sin(a);
  for (let p of polys) {
    const pts = [];
    for (var i = 0; i < p.points.length; i += 2) {
      pts.push(p.points[i]*ca*s - p.points[i+1]*sa*s + x);
      pts.push(p.points[i+1]*ca*s + p.points[i]*sa*s + y);
    }
    if (p.fill) g.setColor(p.fill).fillPoly(pts);
    if (p.stroke) g.setColor(p.stroke).drawPoly(pts);
  }
}

let beatCount = 1;
setInterval(readHRM,100);

