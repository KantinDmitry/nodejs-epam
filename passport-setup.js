import passport from 'passport';
import LocalStrategy from 'passport-local';
import FacebookStrategy from 'passport-facebook';
import { users } from 'data';
import passwordHash from 'password-hash';
import find from 'lodash.find';
import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from 'config/configuration';

const LocalStrategyConfig = {
    usernameField: 'name',
    passwordField: 'password',
    session: false,
};

const localStrategy = new LocalStrategy(LocalStrategyConfig, (username, password, done) => {
    const user = find(users, { name: username });

    if (!user || !passwordHash.verify(password, user.passwordHash)) {
        done(null, false, 'wrong combination of name and password');
    } else {
        done(null, user);
    }
});

const FacebookStrategyConfig = {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:8080/api/auth/facebook/callback',
};

const facebookStrategy = new FacebookStrategy(
    FacebookStrategyConfig,
    (accessToken, refreshToken, profile, done) => {
        console.log({
            accessToken,
            refreshToken,
            profile,
            done,
        });

        return done(null, profile);
    }
);

passport.use(facebookStrategy);
passport.use(localStrategy);

export default passport;
