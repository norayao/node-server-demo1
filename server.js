// 导入文件系统模块(fs)
var fs = require('fs');

// 创建服务对象
const http = require('http');
var port = process.argv[2];
var URL = require('url');

const server = http.createServer((request, response) => {
    // 从请求中获取 请求头（headers），请求方法（method=GET|POST），URL
    const { headers, method, url } = request;

    // path and query, like /xxx?q=123
    // console.log(url);
    // method, like GET
    // console.log(method);
    // host and port, like localhost:8888
    // console.log(headers.host);
    // var pathWithQuery = headers.host + url;

    var parsedUrl = URL.parse(request.url, true);
    var pathWithQuery = request.url;
    var path = parsedUrl.pathname;
    var query = parsedUrl.query;
    var queryString = '';
    if (pathWithQuery.indexOf('?') >= 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
    }
    // 收到request并打印其路径和参数
    console.log('New request - Path and Query: ' + pathWithQuery);

    let body = [];
    request.on('error', (err) => {
        // 请求错误 400 Bad Request
        console.error(err);
        response.statusCode = 400;
        response.end();
    }
        // 获取请求体，通过监听 'data' 和 'end' 事件取出数据。
    ).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
    });

    // 根据request path返回不同的response header
    response.on('error', (err) => {
        console.error(err);
    });

    if (path === '/') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`
        <link rel="stylesheet" href="./style.css">
        <h1>Hello World</h1>
        `)

    } else if (path === '/style.css') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/css;charset=utf-8')
        response.write(`h1{color: red;}`)
        response.end()
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`你输入的路径不存在对应的内容`)

    }
    /* Response Body
    const responseBody = { headers, method, url, body };
    response.write(JSON.stringify(responseBody));
    response.end();
    */
})

server.listen(port);
console.log('Listen ' + port + ' successfully. You can open the page through http://localhost:' + port);

