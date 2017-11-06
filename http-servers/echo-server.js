const http = require('http');
const url = require('url');

const HOSTNAME = 'localhost';
const PORT = 3000;
const MESSAGE_404 = 'Page not found. Use echo query param';

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.query.echo) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(parsedUrl.query.echo);
    } else {
        res.writeHead(404);
        res.end(MESSAGE_404);
    }
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
