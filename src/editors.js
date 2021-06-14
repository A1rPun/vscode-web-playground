const vscode = require('vscode');
const getWebViewHtml = require('./webviewhtml.js');
const sass = require('sass');

const viewColumn = vscode.ViewColumn.Beside;

module.exports = {
  web: null,
  html: null,
  scss: null,
  javascript: null,
  library: null,
  changeHandle: null,
  getHtml() {
    return this.html.getText();
  },
  getCss() {
    return sass.renderSync({ data: this.scss.getText() }).css.toString();
  },
  getJs() {
    return this.javascript.getText();
  },
  getLibraryCss() {
    return this.library?.css ?? '';
  },
  getLibraryJs() {
    return this.library?.javascript ?? '';
  },
  update() {
    if (!this.web) return;
    this.web.webview.html = getWebViewHtml(
      this.getHtml(),
      this.getCss(),
      this.getJs(),
      this.getLibraryCss(),
      this.getLibraryJs()
    );
  },
  createWeb() {
    if (this.web) {
      this.web.reveal();
    } else {
      this.web = vscode.window.createWebviewPanel(
        'webplayground',
        'Web Playground',
        viewColumn,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );
      this.web.onDidDispose(() => {
        this.web = undefined;
      });
    }
  },
  async create(language, content = '') {
    if (this[language] && !this[language].isClosed) return;
    await vscode.workspace
      .openTextDocument({
        content,
        language,
      })
      .then((doc) => {
        return vscode.window.showTextDocument(doc, {
          viewColumn,
        });
      })
      .then((editor) => (this[language] = editor.document));
  },
  setChangeHandler() {
    if (this.changeHandle) return;

    let timeout = undefined;
    this.changeHandle = vscode.workspace.onDidChangeTextDocument(() => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => this.update(), 500);
    });
  },
  setLibrary(library) {
    this.library = library;
  },
  async init() {
    this.createWeb();
    await this.create('html');
    await this.create('scss');
    await this.create('javascript');
    this.setChangeHandler();
  },
  close() {
    if (this.web) this.web.dispose();
    this.html = null;
    this.scss = null;
    this.javascript = null;
    this.library = null;
    if (this.changeHandle) this.changeHandle.dispose();
  },
};
