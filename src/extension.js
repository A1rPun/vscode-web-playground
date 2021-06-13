const { open, close, jsfiddle, codepen } = require('./commands.js');

function activate(context) {
  context.subscriptions.push(open());
  context.subscriptions.push(close());
  context.subscriptions.push(jsfiddle());
  context.subscriptions.push(codepen());
}

module.exports = { activate };
