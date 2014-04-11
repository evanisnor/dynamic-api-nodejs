var http = require('http');
var parse = require('url').parse;
var datalayer = require('./datalayer.js');

var PORT = 9000;


var handleRequest = function(request, response) {
    var method = request.method;
    var url = parse(request.url)
    var path = parsePath(url.pathname, method);
    var query = url.query;

    if (!path) {
        response.writeHead(404);
        response.end();
        return;
    }

    switch (method) {
        case 'GET':
            datalayer.view(path, query, function(content, success) {
                if (success) {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.write(JSON.stringify(content));
                }
                else {
                    response.writeHead(404);
                }
                response.end();
            });
            break;
        case 'POST':
            request.on('data', function(body) {
                body = JSON.parse(body);
                datalayer.create(path, body, function(id, success) {
                    if (success) {
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.write(id);
                    }
                    else {
                        response.writeHead(404);
                    }
                    response.end();
                });
            });
            break;
        case 'PUT':
            request.on('data', function(body) {
                body = JSON.parse(body);
                datalayer.update(path, body, function(success) {
                    if (success) {
                        response.writeHead(200);
                    }
                    else {
                        response.writeHead(404);
                    }
                    response.end();
                });
            });
            break;
        case 'DELETE':
            datalayer.delete(path, query, function(success) {
                if (success) {
                   response.writeHead(200);
                }
                else {
                   response.writeHead(404);
                }
                response.end();
            });
            break;
    }
};

var parsePath = function(path, method) {
    var group = path.match(/^\/~([a-zA-Z0-9]+)\/([a-zA-Z0-9\/]+)\/?/);
    if (group && group.length > 1 && method) {
        return {
            'customer' : group[1],
            'path' : group[2],
            'method' : method
        };
    }
};

http.createServer(handleRequest).listen(PORT, '127.0.0.1');
console.log('Server running at http://127.0.0.1:' + PORT);