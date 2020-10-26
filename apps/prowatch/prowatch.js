(() => {
	Bangle.setLCDMode()
    let stepCount = 0;
	const COLORTEXT = ['Yellow','Navy', 'DarkGreen','DarkCyan','Pink'];
	const pal = [0xFFE0,0x000F, 0x03E0,0x03EF,0xF81F];

	const storage = require('Storage');
	const SETTINGS_FILE = 'prowatch.settings.json';
	const s = storage.readJSON(SETTINGS_FILE, 1) || {};

	const textColor =s.textColor;
	const textBold = s.textBold;
	const cval = pal[COLORTEXT.indexOf(textColor)];
	const is12Hour = (storage.readJSON('setting.json', 1) || {})['12hour'];
	
	
	require("Font8x16").add(Graphics); g.setFont8x16();
	const drawBackground = ()=>{
		let f = (require("Storage").read("backgrnd.img"));
		g.drawImage(f,0,5);
		g.setRotation(2);
		g.drawImage(f,0,5);
		g.setRotation(0);
		delete f;
	};
  const getFile = (file,ind)=>{
    return (require("Storage").read(file));
  };
	const drawTime = (clear,bold)=>{
        if(clear)g.clearRect(10,30,230,130);
		let d = new Date();
        let scl =1;
        g.setColor(cval);
		g.drawImage(eval(getNumber(formatTime(d,"H").charAt(0))),0+18,24+20,{scale:scl});
		g.drawImage(eval(getNumber(formatTime(d,"H").charAt(1))),0+20+40+4,24+20,{scale:scl});
		g.drawImage(eval(getNumber(formatTime(d,"M").charAt(0))),0+125,24+20,{scale:scl});
		g.drawImage(eval(getNumber(formatTime(d,"M").charAt(1))),0+170,24+20,{scale:scl});
	};
  
  const formatTime =(d,f) =>{
    let h  = d.getHours();
    let ampm;
    if(is12Hour){
      ampm = h>12 ?"PM":"AM";
      h = h <= 12 ? h : h - 12;
    }
    g.drawString(ampm,190,120);
    if(f=="H"){return (h<10?'0':'') + h;}
    if(f=="M"){return (d.getMinutes()<10?'0':'') + d.getMinutes();}
  };
  
   const drawBattWid =()=>{
        let vper= "--";
        g.setColor(0xFD20);
		g.fillCircle(125,170,25);
		g.setColor(0);
		g.fillCircle(125,170,23);
        if(Bangle.isCharging()){
          g.drawImage(getFile("charge.img"),110,155);
        }
        else{
           g.drawImage(getFile("bat.img"),110,155);
           vper = E.getBattery()+" %";
        }
		g.setColor(0xFD20);
		g.drawString(vper,115,200);
   }
	const drawFaceWidgets =()=>{
        g.clearRect(0,200,240,215);
		g.setColor(0x07FF);
		g.fillCircle(45,170,25);
		g.setColor(0);
		g.fillCircle(45,170,23);
		g.drawImage(getFile("foot.img"),30,155);
        g.setColor(0x07FF);
        g.drawString(stepCount,30,200);

		drawBattWid();

        g.setColor(0xF800);
		g.fillCircle(200,170,25);
		g.setColor(0);
		g.fillCircle(200,170,23);
		g.drawImage(getFile("heart.img"),185,155);
		g.setColor(0xF800);
		g.drawString("65 bpm",180,200);

	};
	const getNumber = (d) =>{

	  let f= require("Storage").read(textBold?"font-module-bold.js":"font-module-normal.js");
	  d= f.split(";")[parseInt(d)];
	  delete f;
	  return d;
	};

	let iTick;
	const start = () => {
		drawTime();
		drawFaceWidgets();
		tick();
		iTick = setInterval(tick, 1000);
	};
	const stop = () => {
		if (iTick) {
		  clearInterval(iTick);
		  iTick = undefined;
		}
	};
  let lastMinute = 0;
  const tick = ()=>{
    let d = new Date();
    let s = d.getSeconds();
    if(d.getMinutes() > lastMinute){
      drawTime(true);
    }
    if(s%2){
      g.setColor(cval);
    }else{
       g.setColor(0);
    }
    g.fillCircle(115,60,5);
    g.fillCircle(115,90,5);
    lastMinute = d.getMinutes();
  };

    Bangle.on('step', function(up) {stepCount++;});
    Bangle.on('charging', function(charging) {
      if(!Bangle.isLCDOn())Bangle.setLCDPower(1);
      drawBattWid();
      Bangle.buzz();
    });
	// clean app screen
	  g.clear();
	  // Show launcher when middle button pressed
	  setWatch(Bangle.showLauncher, BTN2, {repeat: false, edge: 'falling'});
      Bangle.on('touch', function(button) {
       if(!Bangle.isLCDOn()) {Bangle.setLCDPower(1);return;}
       //if(button==2) load("prowatch.hrm.js");
       //if(button==1)load("activepedom.app.js");
       });
	  Bangle.on('lcdPower', function (on) {
		if (on) {
		  start();
		} else {
		  stop();
		}
	  });
      drawBackground();
	  start();
})();

