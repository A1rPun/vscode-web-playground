const vscode = require('vscode');
const editors = require('./../editors.js');
const postUrl = require('./../postUrl.js');

async function toJsFiddle() {
  const hostName = 'http://jsfiddle.net/api/post/library/pure/';
  const url = postUrl(hostName, {
    css: escape(editors.getCss()),
    js: escape(editors.getJs()),
    html: escape(editors.getHtml()),
    panel_css: 1,
  });
  vscode.env.openExternal(url);
  vscode.window.showInformationMessage('Successfully Exported to JsFiddle!');
}

module.exports = () =>
  vscode.commands.registerCommand(
    'extension.webplaygroundjsfiddle',
    toJsFiddle
  );
