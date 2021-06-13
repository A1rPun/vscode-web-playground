const vscode = require('vscode');
const editors = require('./../editors.js');

async function main() {
  await editors.init();
  editors.update();
  vscode.commands.executeCommand('workbench.action.editorLayoutTwoByTwoGrid');
  vscode.window.showInformationMessage(
    'Successfully Initialized Web Playground!'
  );
}

module.exports = () =>
  vscode.commands.registerCommand('extension.webplayground', main);
