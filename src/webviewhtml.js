module.exports = (
  html,
  css,
  js,
  libraryCss,
  libraryJs
) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${libraryCss}
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
      ${css}
    </style>
  </head>
  <body>
    ${html}
    <pre id="vscode_web_playground_console" class="hide"></pre>
    ${libraryJs}
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
      ${js}
    </script>
  </body>
</html>`;
