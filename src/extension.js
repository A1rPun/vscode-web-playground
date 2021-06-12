const vscode = require('vscode');
const sass = require('sass');

let currentPanel = undefined;
let htmlDocument = undefined;
let cssDocument = undefined;
let javascriptDocument = undefined;
const viewColumn = vscode.ViewColumn.Beside;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const wpg = vscode.commands.registerCommand('extension.webplayground', main);
  context.subscriptions.push(wpg);
  const cwpg = vscode.commands.registerCommand(
    'extension.webplaygroundclose',
    closeAll
  );
  context.subscriptions.push(cwpg);
}

function main() {
  createDocuments();
  showWebPlayground();
  vscode.window.showInformationMessage(
    'Successfully Initialized Web Playground!'
  );
}

function closeAll() {
  if (currentPanel) {
    currentPanel.dispose();
    currentPanel = undefined;
  }
  if (htmlDocument) htmlDocument = undefined;
  if (cssDocument) cssDocument = undefined;
  if (javascriptDocument) javascriptDocument = undefined;
  vscode.window.showInformationMessage('Successfully Closed Web Playground!');
}

async function createDocuments() {
  const docs = [];

  if (!cssDocument || cssDocument.isClosed) {
    docs.push(
      createTextDocument('scss').then((doc) => {
        cssDocument = doc;
      })
    );
  }

  if (!htmlDocument || htmlDocument.isClosed) {
    docs.push(
      createTextDocument('html').then((doc) => {
        htmlDocument = doc;
      })
    );
  }

  if (!javascriptDocument || javascriptDocument.isClosed) {
    docs.push(
      createTextDocument('javascript').then((doc) => {
        javascriptDocument = doc;
      })
    );
  }

  Promise.allSettled(docs).then(() => {
    vscode.commands.executeCommand('workbench.action.editorLayoutTwoByTwoGrid');
    updateWebView();
  });
  vscode.workspace.onDidChangeTextDocument(updateWebView);
}

function showWebPlayground() {
  if (currentPanel) {
    currentPanel.reveal();
  } else {
    currentPanel = vscode.window.createWebviewPanel(
      'webplayground',
      'Web Playground',
      viewColumn,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });
  }
}

function createTextDocument(language, content = '') {
  return vscode.workspace
    .openTextDocument({
      content,
      language,
    })
    .then((doc) => {
      return vscode.window.showTextDocument(doc, {
        viewColumn,
      });
    })
    .then((editor) => editor.document);
}

function updateWebView() {
  const theHtml = htmlDocument.getText();
  const theCss = sass.renderSync({ data: cssDocument.getText() }).css;
  currentPanel.webview.html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      ${theCss}
    </style>
  </head>
  <body>
    ${theHtml}
    <script type="text/javascript">
      ${javascriptDocument.getText()}
    </script>
  </body>
</html>`;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
