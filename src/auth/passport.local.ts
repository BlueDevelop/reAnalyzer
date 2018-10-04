import {Strategy} from 'passport-local';
import User from '../users/user.model';
import infoLogger from '../loggers/info.logger';
import errorLogger from '../loggers/error.logger';

const strategy = new Strategy({
  usernameField: 'uniqueId',
  passwordField: 'password',
  passReqToCallback : true 
}, (req, uniqueId, password, done) => {
    User.findOne({ uniqueId: uniqueId }, function(err, user) {
      if (err) { 
        errorLogger.error('%j', {
          message: err.message,
          stack: err.stack,
          name:err.name
        });
        return done(err); 
      }
      if (!user) {
        infoLogger.info(`${req.ip} tried to login using this unknown uniqueId: ${uniqueId}.`);
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      if (!user.validPassword(password)) {
        infoLogger.info(`${req.ip} tried to login using this uniqueId: ${uniqueId} and failed.`);
        return done(null, false, { message: 'ncorrect username or password.' });
      }

      infoLogger.info(`${req.ip} authenticated with uniqueId: ${uniqueId} successfully.`);
      return done(null, user);
    });
  });

  export default strategy;