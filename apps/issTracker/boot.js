// check for alarms
(function() {
    var issPasses = require('Storage').readJSON('iss-pass.json',1)||[];
    var time = new Date();
    if (issPasses.length) {
      issPasses = issPasses.sort((a,b)=>(a.hr-b.hr));
      var hr = time.getHours()+(time.getMinutes()/60)+(time.getSeconds()/3600);
      var t = 3600000*(active[0].hr-hr); //TODO add some time before pass happen
        if (t < 0) t += 86400000;
        if (t<1000) t=1000;
        setTimeout(function() {
          load("notifypass.js");
        },t);
    }
  })();
  