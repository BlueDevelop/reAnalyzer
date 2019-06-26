import passport, { Profile } from 'passport';
import { Application, Request, Response, NextFunction } from 'express';

import userModel from '../users/user.model';
import Iuser from '../users/user.interface';
import LocalStrategy from './passport.local';
import SamlStrategyGenerator from './passport.saml';
import ShragaStrategyGenerator from './passport.shraga';
import getConfig from '../config';
import { Strategy } from 'passport-strategy';
import { urlencoded } from 'body-parser';
const config = getConfig();

const authenticateLocal = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error, user: Iuser) => {
    if (err) {
      res.sendStatus(401);
    } else if (!user) {
      res.sendStatus(401);
    } else {
      req.logIn(user, (error: Error) => {
        if (error) {
          res.sendStatus(401);
        } else {
          res.status(200).send(user);
        }
      });
    }
  })(req, res, next);
};

const authenticateSaml = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true })(
    req,
    res,
    next
  );
};

const authenticateShraga = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('shraga', (err: Error, user: any) => {
    if (err) {
      res.sendStatus(401);
    } else if (!user) {
      res.sendStatus(401);
    } else {
      req.logIn(user, (error: Error) => {
        if (error) {
          res.sendStatus(401);
        } else {
          res.status(200).send(user);
        }
      });
    }
  })(req, res, next);
};

// export const authenticate = config.useSaml
//   ? authenticateSaml
//   : authenticateLocal;
export const authenticate = config.useShraga
  ? authenticateShraga
  : authenticateLocal;

export const init = (app: Application) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: Profile, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
      done(err, user as Iuser);
    });
  });
  if (config.useShraga) {
    passport.use(ShragaStrategyGenerator());
    /* GET home page. */
    app.get('/api/login', passport.authenticate('shraga'), function(
      req,
      res,
      next
    ) {
      res.status(200).json(req.user);
    });

    app.post('/api/login/callback', passport.authenticate('shraga'), function(
      req,
      res,
      next
    ) {
      console.log(req.user);
      // res.status(200).json(req.user);

      return res.redirect('/');
    });
  } else if (config.useSaml) {
    passport.use(SamlStrategyGenerator());
    app.all(
      '/api/login/callback',
      urlencoded({ extended: false }),
      authenticateSaml,
      (req, res) => {
        res.redirect('/');
      }
    );
    app.all('/api/login', authenticateSaml, (req, res) => {
      res.redirect('/');
    });
  } else {
    passport.use(LocalStrategy);
    app.all('/api/login', authenticateLocal);
    app.get('/api/login/success', (req: Request, res: Response) => {
      return res.status(200).send({ user: req.user });
    });
    app.get('/api/login/fail', (_, res: Response) => {
      return res.sendStatus(401);
    });
  }
};
