#!/bin/env node

const fs = require('fs');
const through = require('through2');
const request = require('request');
const path = require('path');
const csv2json = require('csv2json');

const additionalCssPath = 'https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css';

function pipeFileToStdout(filename) {
    fs.createReadStream(filename).pipe(process.stdout);
}

function userInputToUppercaseOutput() {
    function toUpperCase(buffer, encoding, next) {
        const uppercasedChunk = buffer.toString().toUpperCase();
        this.push(uppercasedChunk);
        next();
    }

    const toUpperCasePipe = through(toUpperCase);

    process.stdin.pipe(toUpperCasePipe).pipe(process.stdout);
}

function csvFileToStdout(filename) {
    fs.createReadStream(filename)
        .pipe(csv2json({ separator: ';' }))
        .pipe(process.stdout);
}

function csvFileToJSONFile(filename) {
    const newFilename = filename.replace(/csv$/, 'json');

    fs.createReadStream(filename)
        .pipe(csv2json({ separator: ';' }))
        .pipe(fs.createWriteStream(newFilename));
}

function bundleCss(folderPath) {
    const bundleFileName = path.join(folderPath, 'bundle.css');
    const outputStream = fs.createWriteStream(bundleFileName);
    const additionalCssStream = request.get(additionalCssPath);

    fs.readdir(folderPath, (err, list) => {
        const filteredFilesList = list.filter(filename => filename.match(/css$/));
        const cssFileStreams = filteredFilesList.map((filePath) => {
            const fullPath = path.join(folderPath, filePath);
            return fs.createReadStream(fullPath);
        });

        cssFileStreams.forEach((stream, index, arr) => {
            if (index > 0) {
                arr[index - 1].on('end', () => stream.pipe(outputStream, { end: false }));
            } else {
                stream.pipe(outputStream, { end: false });
            }
        });

        if (cssFileStreams.length) {
            cssFileStreams[cssFileStreams.length - 1].on('end', () => additionalCssStream.pipe(outputStream));
        } else {
            additionalCssStream.pipe(outputStream);
        }
    });
}

function runCommandLineTool() {
    const Minimist = require('minimist'); // eslint-disable-line global-require

    const args = Minimist(process.argv.slice(2), {
        alias: {
            help: 'h',
            action: 'a',
            file: 'f',
            path: 'p',
        },
    });

    if (args.help) {
        printHelpMessage();
        return;
    }

    const { action, file, path: folderPath } = args;

    switch (action) {
    case 'print-file':
        pipeFileToStdout(file);
        break;
    case 'uppercase':
        userInputToUppercaseOutput();
        break;
    case 'output-csv':
        csvFileToStdout(file);
        break;
    case 'convert-csv':
        csvFileToJSONFile(file);
        break;
    case 'bundle-css':
        bundleCss(folderPath);
        break;

    default:
        printHelpMessage();
    }
}

function printHelpMessage() {
    console.log(`
    Use -h (--help) for help
    Usage: ./stream.js -a (--action) acton
    Arguments: -f (--file), -p (--path)
    Actions:
        print-file (-f requred)
        uppercase
        output-csv (-f requred)
        convert-csv (-f requred)
        bundle-css (-p requred)
    `);
}

const isLoadedAsAModule = !!module.parent;

if (isLoadedAsAModule) {
    module.exports = {
        pipeFileToStdout,
        userInputToUppercaseOutput,
        csvFileToStdout,
        csvFileToJSONFile,
        bundleCss,
    };
} else {
    runCommandLineTool();
}
