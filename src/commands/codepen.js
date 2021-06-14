const vscode = require('vscode');
const editors = require('./../editors.js');
const postUrl = require('./../postUrl.js');
const { codePenUrl } = require('./../constants.js');

async function toCodePen() {
  const url = postUrl(codePenUrl, {
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
  vscode.commands.registerCommand('extension.webplayground.codepen', toCodePen);
