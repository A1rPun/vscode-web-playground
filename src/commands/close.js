const vscode = require('vscode');
const editors = require('./../editors.js');

function close() {
  editors.close();
  vscode.commands.executeCommand('workbench.action.editorLayoutSingle');
  vscode.window.showInformationMessage('Successfully Closed Web Playground!');
}

module.exports = () =>
  vscode.commands.registerCommand('extension.webplaygroundclose', close);
