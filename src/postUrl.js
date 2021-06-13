module.exports = (hostName, fields = {}) => {
  const url = `data:text/html,<body onload='document.body.firstChild.submit()'><form method='post' action='${hostName}'>`;
  return Object.entries(fields).reduce((acc, cur) => {
    return acc + `<input type='hidden' name='${cur[0]}' value='${cur[1]}'>`;
  }, url);
};
