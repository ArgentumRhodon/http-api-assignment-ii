const http = require("http");
const url = require("url");
const query = require("querystring");
const htmlHandler = require("./htmlHandler");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    "/": htmlHandler.getIndex,
    "/style.css": htmlHandler.getStyles,
    index: htmlHandler.getIndex,
};

const onRequest = (request, response) => {
    const parsedURL = url.parse(request.url);
    const acceptedTypes = request.headers.accept.split(",");
    const params = query.parse(parsedURL.query);
    if (urlStruct[parsedURL.pathname]) {
        urlStruct[parsedURL.pathname](request, response, acceptedTypes, params);
    } else {
        urlStruct.index(request, response);
    }
};

http.createServer(onRequest).listen(port);
