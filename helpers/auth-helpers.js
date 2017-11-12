// eslint-disable-next-line import/prefer-default-export
export function generateAuthResponse(user, token) {
    return {
        code: 200,
        message: 'OK',
        data: { user },
        token,
    };
}
