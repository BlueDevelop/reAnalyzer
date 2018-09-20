import LocalStrategy from 'passport-local';
import User from '../users/user.model';

const strategy = new LocalStrategy.Strategy({
  usernameField: 'uniqueId',
  passwordField: 'password',
}, (uniqueId, password, done) => {
    User.findOne({ uniqueId: uniqueId }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  });

  export default strategy;