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
  const wpgc = vscode.commands.registerCommand(
    'extension.webplaygroundclose',
    closeAll
  );
  context.subscriptions.push(wpgc);
  const wpgfiddle = vscode.commands.registerCommand(
    'extension.webplaygroundjsfiddle',
    toJsFiddle
  );
  context.subscriptions.push(wpgfiddle);
  const wpgcodepen = vscode.commands.registerCommand(
    'extension.webplaygroundcodepen',
    toCodePen
  );
  context.subscriptions.push(wpgcodepen);
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

function makePostUrl(hostName, fields = {}) {
  const url = `data:text/html,<body onload='document.body.firstChild.submit()'><form method='post' action='${hostName}'>`;
  return Object.entries(fields).reduce((acc, cur) => {
    return acc + `<input type='hidden' name='${cur[0]}' value='${cur[1]}'>`;
  }, url);
}

async function toJsFiddle() {
  const hostName = 'http://jsfiddle.net/api/post/library/pure/';
  const url = makePostUrl(hostName, {
    css: escape(getCss()),
    js: escape(javascriptDocument.getText()),
    html: escape(htmlDocument.getText()),
    panel_css: 1,
  });
  vscode.env.openExternal(url);
  vscode.window.showInformationMessage('Successfully Exported to JsFiddle!');
}

async function toCodePen() {
  const hostName = 'https://codepen.io/pen/define/';
  const url = makePostUrl(hostName, {
    data: JSON.stringify({
      css: getCss(),
      js: javascriptDocument.getText(),
      html: htmlDocument.getText(),
      css_pre_processor: 'scss',
    }),
  });
  vscode.env.openExternal(url);
  vscode.window.showInformationMessage('Successfully Exported to CodePen!');
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

function getCss() {
  return sass.renderSync({ data: cssDocument.getText() }).css.toString();
}

function updateWebView() {
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
      ${getCss()}
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
