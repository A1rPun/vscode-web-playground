const vscode = require('vscode');
const editors = require('./../editors.js');
const libraries = require('./../libraries.js');

async function addLibrary() {
  const currentLibrary = editors.library;
  const [choice] = await vscode.window
    .showQuickPick(
      libraries.map((x) => `${x.name}${x === currentLibrary ? ' ✓' : ''}`)
    )
    .then((x) => x?.split(' ') ?? []);

  if (!choice) return;
  const lib = libraries.find((x) => x.name === choice);
  const hasLibrary = lib === currentLibrary;
  editors.setLibrary(hasLibrary ? null : lib);

  vscode.window.showInformationMessage(
    `Successfully ${hasLibrary ? 'Removed' : 'Set'} ${choice}!`
  );
}

module.exports = () =>
  vscode.commands.registerCommand(
    'extension.webplayground.addlibrary',
    addLibrary
  );
