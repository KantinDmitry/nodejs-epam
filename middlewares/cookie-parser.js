const COOCKIE_SPLIT_REGEX = /(.+?)=(.+)/;

function cookieReducer(acc, current) {
    const matchResult = current.match(COOCKIE_SPLIT_REGEX) || [];
    const fieldName = matchResult[1];
    const value = matchResult[2];

    if (fieldName) {
        acc[fieldName] = value;
    }

    return acc;
}

function cookieParser(req, res, next) {
    const cookieString = req.headers.cookie || '';
    const parsedCookie = cookieString.split('; ').reduce(cookieReducer, {});

    req.parsedCookie = parsedCookie;
    next();
}

export default cookieParser;
