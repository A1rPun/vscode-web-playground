# Web Playground

> Fiddle around with web tech in VSCode!

![Example usage](example.png)

## Usage

- `Ctrl` + `Shift` + `P`
- `webplayground`

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

## TODO

- haml/ts
- libraries
- Export to jsfiddle/codepen/jsbin
- build HTML on save?
- keep state (temp files?)
