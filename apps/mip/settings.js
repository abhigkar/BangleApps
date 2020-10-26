// make sure to enclose the function in parentheses
(function(back) {
  let settings = require('Storage').readJSON('mip.json',1)||{};
  function save(key, value) {
    settings[key] = value;
    require('Storage').write('mip.json',settings);
  }
  const appMenu = {
    '': {'title': 'App Settings'},
    '< Back': back,
    'Monkeys': {
      value: settings.monkeys||12,
      onchange: (m) => {save('monkeys', m)}
    }   
  };
  E.showMenu(appMenu)
})