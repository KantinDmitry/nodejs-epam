import url from 'url';

function queryeParser(req, res, next) {
    const parsedUrl = url.parse(req.url, true);

    req.parsedQuery = parsedUrl.query;
    next();
}

export default queryeParser;
