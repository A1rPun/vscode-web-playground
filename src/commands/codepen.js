const vscode = require('vscode');
const editors = require('./../editors.js');
const postUrl = require('./../postUrl.js');

async function toCodePen() {
  const hostName = 'https://codepen.io/pen/define/';
  const url = postUrl(hostName, {
    data: JSON.stringify({
      css: editors.getCss(),
      js: editors.getJs(),
      html: editors.getHtml(),
      css_pre_processor: 'scss',
    }),
  });
  vscode.env.openExternal(url);
  vscode.window.showInformationMessage('Successfully Exported to CodePen!');
}

module.exports = () =>
  vscode.commands.registerCommand('extension.webplaygroundcodepen', toCodePen);
