import passport, { Profile } from 'passport';
import { Application } from 'express';

import userModel from '../users/user.model';
import IUser from '../users/user.interface';
import LocalStrategy from './passport.local';

export const authenticate = passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/',
                                                    failureFlash: false });

export const init = (app: Application) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user:Profile, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        userModel.findById(id, (err, user) => {
            done(err, <IUser>user);
        });
    });

    passport.use(LocalStrategy);

    app.post('/api/login', authenticate);
};