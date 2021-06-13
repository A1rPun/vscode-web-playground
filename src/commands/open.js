const vscode = require('vscode');
const editors = require('./../editors.js');

let firstTime = true;

async function main() {
  await editors.init();
  editors.update();
  vscode.commands.executeCommand('workbench.action.editorLayoutTwoByTwoGrid');

  if (firstTime) {
    let timeout = undefined;
    vscode.workspace.onDidChangeTextDocument(() => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(editors.update, 500);
    });
    firstTime = false;
  }
  vscode.window.showInformationMessage(
    'Successfully Initialized Web Playground!'
  );
}

module.exports = () =>
  vscode.commands.registerCommand('extension.webplayground', main);
