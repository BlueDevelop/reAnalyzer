import passport, { Profile } from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import { Application } from 'express';

import userModel from '../users/user.model';
import IUser from '../users/user.interface';

const mongoStore = require('connect-mongo')(session);

export default (app: Application) => {
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
};