const vscode = require('vscode');
const sass = require('sass');

let currentPanel = undefined;
let htmlDocument = undefined;
let cssDocument = undefined;
let javascriptDocument = undefined;
let timeout = undefined;
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
  if (currentPanel) currentPanel.dispose();
  if (htmlDocument) htmlDocument = undefined;
  if (cssDocument) cssDocument = undefined;
  if (javascriptDocument) javascriptDocument = undefined;

  vscode.commands.executeCommand('workbench.action.editorLayoutSingle');
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
  vscode.workspace.onDidChangeTextDocument(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(updateWebView, 500);
  });
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
  const scss = sass.renderSync({ data: cssDocument.getText() }).css;
  currentPanel.webview.html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      #vscode_web_playground_console {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0;
        max-height: 150px;
        background: #000;
        color: #32cd32;
        overflow-y: scroll;
        overflow-x: hidden;
      }
      #vscode_web_playground_console.hide {
        display: none;
      }
      ${scss}
    </style>
  </head>
  <body>
    ${htmlDocument.getText()}
    <pre id="vscode_web_playground_console" class="hide"></pre>
    <script type="text/javascript">
      window.console = {
        el: document.querySelector('#vscode_web_playground_console'),
        log(...args) {
          this.el.classList.remove('hide');
          args.forEach((arg) => {
            this.el.append(JSON.stringify(arg, null, 2), ' ');
          });
          this.el.append(document.createElement('br'));
        },
      };
      ${javascriptDocument.getText()}
    </script>
  </body>
</html>`;
}

module.exports = { activate };
