const http = require('http');
const url = require('url');
const query = require('querystring');
const clientHandler = require('./clientHandler');
const jsonHandler = require('./jsonResponse');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

const urlStruct = {
  GET: {
    '/': clientHandler.getIndex,
    '/style.css': clientHandler.getStyles,
    '/client.js': clientHandler.getJS,
    '/getUsers': jsonHandler.getUsers,
    index: clientHandler.getIndex,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    '/addUser': jsonHandler.addUser,
    notFound: jsonHandler.notFoundMeta,
  },
};

const handlePost = (request, response, parsedURL) => {
  if (urlStruct.POST[parsedURL.pathname]) {
    parseBody(request, response, jsonHandler.addUser);
  }
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  if (!urlStruct[request.method]) {
    return urlStruct.HEAD.notFound(request, response);
  }

  if (request.method === 'POST') {
    return handlePost(request, response, parsedURL);
  }
  if (urlStruct[request.method][parsedURL.pathname]) {
    return urlStruct[request.method][parsedURL.pathname](
      request,
      response,
    );
  }
  return urlStruct[request.method].notFound(request, response);
};

http.createServer(onRequest).listen(port);
