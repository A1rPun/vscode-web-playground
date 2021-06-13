# Web Playground

> Fiddle around with web tech in VSCode!

- CSS / SCSS
- HTML
- JavaScript

![Example usage](example.png)

## Usage

- `Ctrl` + `Shift` + `P`

**Commands**

- `webplayground`
- `webplaygroundclose`
- `webplaygroundjsfiddle`
- `webplaygroundcodepen`

**Optional steps**

- `Ctrl` + `b` to hide sidebar

## Debug

`F5` in VSCode

## Local build/install

```
$ npm install -g vsce
$ vsce login {user}
$ vsce package
$ code --install-extension vscode-web-playground-{version}.vsix
```

### Uninstall

```
$ code --uninstall-extension vscode-web-playground-{version}.vsix
```

Or

- `Ctrl` + `Shift` + `X`
- Search and uninstall

## Core functionality

Making use of the built-in webview which renders the following HTML

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      { CSS }
    </style>
  </head>
  <body>
    { HTML }
    <script type="text/javascript">
      { JavaScript }
    </script>
  </body>
</html>
```

## Export

Limited functionality.
Can only handle code without the single quote `'` character.
Can only handle code less than 1900 characters.

- [JsFiddle](https://docs.jsfiddle.net/api/display-a-fiddle-from-post)
- [CodePen](https://blog.codepen.io/documentation/prefill/)
- <s>[JsBin](https://jsbin.com/help/api/) (need token)</s>

## TODO

- Better export
- haml/ts
- libraries (vue/angular/react/bootstrap)
