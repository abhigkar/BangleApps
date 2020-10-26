(() => {
	function start(){
		g.drawString("Hello Sam", 10,10);
	}
	start();
	Bangle.on('lcdPower', (on) => {
        if (on) {
            // call your app function here
			start();
    }});
})();
