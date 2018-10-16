import passport, { Profile } from 'passport';
import { Application } from 'express';
import { Request, Response, NextFunction } from 'express';
import userModel from '../users/user.model';
import IUser from '../users/user.interface';
import LocalStrategy from './passport.local';

//export const authenticate = passport.authenticate('local', { successRedirect: '/api/login/success',
//                                                    failureRedirect: '/api/login/fail',
//                                                    failureFlash: false });

export const authenticate = (req:Request,res:Response,next:NextFunction) => {
    passport.authenticate('local', (err:any, user:any, info:any) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (!user) {
            res.status(500).send({ message: "User does not exist" });
        }
        else {
            req.logIn(user, function (err:any) {
                if (err) {
                    res.status(500).send({ message: "Login error" });
                }
                else {
                    res.status(200).send(user);
                }
            });
        }
    })(req, res,next);


}; 

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
    app.get('/api/login/success', (req, res) => {

        return res.status(200).send({user:req.user});
    });
    app.get('/api/login/fail', (req, res) => {
        return res.status(401);
    });
};