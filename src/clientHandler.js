const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const styles = fs.readFileSync(`${__dirname}/../client/style.css`);
const js = fs.readFileSync(`${__dirname}/../client/client.js`);

const respond = (request, response, content, type) => {
  response.writeHead(200, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const getStyles = (request, response) => {
  respond(request, response, styles, 'text/css');
};

const getIndex = (request, response) => {
  respond(request, response, index, 'text/html');
};

const getJS = (request, response) => {
  respond(request, response, js, 'text/javascript');
};

module.exports = {
  getIndex,
  getStyles,
  getJS,
};
