// make sure to enclose the function in parentheses
(function(back) {
	
  const storage = require('Storage');
  const SETTINGS_FILE = 'prowatch.settings.json';
  const COLORTEXT = ['Yellow','Navy', 'DarkGreen','DarkCyan','Pink'];
  let s = {
    'textColor': COLORTEXT[0],
	'textBold': false,
  };
  const saved = storage.readJSON(SETTINGS_FILE, 1) || {};
  for (const key in saved) {
    s[key] = saved[key];
  }
  
  
  function save(key) {
    return function (value) {
      s[key] = value;
      storage.write(SETTINGS_FILE, s);
    };
  }
  const appMenu = {
    '': {'title': 'App Settings'},
    '< Back': back,
    'Text color': {
      format: () => s.textColor,
      onchange: function () {
        // cycles through options
        const oldIndex = COLORTEXT.indexOf(s.textColor)
        const newIndex = (oldIndex + 1) % COLORTEXT.length
        s.textColor = COLORTEXT[newIndex]
        save('textColor')(s.textColor)
      },
    },
	"Text Bold" : {
		value : s.textBold,
		format : v => v?"On":"Off",
		onchange : v => { 
			s.textBold=v;
			save('textBold')(s.textBold);
		}
	}
  };
  E.showMenu(appMenu)
})

	
	
/*
Maroon	0x7800
Purple	0x780F
Olive	0x7BE0
LightGray	0xC618
DarkGrey	0x7BEF
Blue	0x001F
Green	0x07E0
Cyan	0x07FF
RED	0xF800
Magenta	0xF81F
Yellow	0xFFE0
White	0xFFFF
Orange	0xFD20
GreenYellow	0xAFE5
Pink	0xF81F
*/