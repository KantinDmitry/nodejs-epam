const http = require('http');
const fs = require('fs');
const path = require('path');
const through = require('through2');

const HOSTNAME = 'localhost';
const SYNC_HANDLER_PORT = 3000;
const PIPE_HANDLER_PORT = 3001;
const CONTENT_FILE_PATH = path.join('http-servers', 'index.html');
const MESSAGE_PATTERN = '{message}';
const MESSAGE = 'Hello from HTML server';

function replaceMessage(buffer, encoding, next) {
    const transformedMessage = buffer.toString().replace(MESSAGE_PATTERN, MESSAGE);
    this.push(transformedMessage);
    next();
}

const syncRequestHandler = (req, res) => {
    const fileContent = fs.readFileSync(CONTENT_FILE_PATH, 'utf8');
    const responseText = fileContent.replace(MESSAGE_PATTERN, MESSAGE);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(responseText);
};

const pipeRequestHandler = (req, res) => {
    const fileStream = fs.createReadStream(CONTENT_FILE_PATH);
    const contentTransformPipe = through(replaceMessage);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    fileStream.pipe(contentTransformPipe).pipe(res);
};

const syncServer = http.createServer(syncRequestHandler);
const pipeServer = http.createServer(pipeRequestHandler);


syncServer.listen(SYNC_HANDLER_PORT, HOSTNAME, () => {
    console.log(`Sync server running at http://${HOSTNAME}:${SYNC_HANDLER_PORT}/`);
});

pipeServer.listen(PIPE_HANDLER_PORT, HOSTNAME, () => {
    console.log(`Pipe server running at http://${HOSTNAME}:${PIPE_HANDLER_PORT}/`);
});
