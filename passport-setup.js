import passport from 'passport';
import LocalStrategy from 'passport-local';
import { users } from 'data';
import passwordHash from 'password-hash';
import find from 'lodash.find';

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

passport.use(localStrategy);

export default passport;
