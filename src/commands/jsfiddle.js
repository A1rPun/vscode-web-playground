const vscode = require('vscode');
const editors = require('./../editors.js');
const postUrl = require('./../postUrl.js');
const { jsFiddleUrl } = require('./../contants.js');

async function toJsFiddle() {
  const url = postUrl(jsFiddleUrl, {
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
