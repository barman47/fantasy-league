const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use('user', new LocalStrategy({
        usernameField: "usernameLogin",
        passwordField: "passwordLogin",
        passReqToCallback: true
      }, function verifyCallback(req, usernameLogin, passwordLogin, done) {
            User.findOne({ username: usernameLogin }, function(err, user) {
            if (err) return done(err);
            if (!user) {
                return done(null, false, {msg: 'No user found'});
            }
            bcrypt.compare(passwordLogin, user.password, (err, isMatch) => {
                if (err) return done(err);
                if (!isMatch) {
                    return done(null, false, {msg: 'Incorrect Password'});
                } else {
                    return done(null, user);
                }
            });
        });
    }));

    passport.use('admin', new LocalStrategy({
        usernameField: 'loginUsername',
        passwordField: 'loginPassword',
        passReqToCallback: true
    }, function verifyCallback (req, loginUsername, loginPassword, done) {
        Admin.findOne({username: loginUsername}, (err, admin) => {
            if (err) {
                return done (err);
            }

            if (!admin) {
                return done(null, false, {msg: 'No Admin found'});
            }
            bcrypt.compare(loginPassword, admin.password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done (null, false, {msg: 'Incorrect Password'});
                } else {
                    return done(null, admin);
                }
            });
        });
    }));

    let SessionConstructor = function (userId, userGroup, details) {
        this.userId = userId;
        this.userGroup = userGroup;
        this.details = details;
    }

    passport.serializeUser(function (userObject, done) {
    // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
    let userGroup = "User";
    let userPrototype =  Object.getPrototypeOf(userObject);

    if (userPrototype === User.prototype) {
        userGroup = "User";
    } else if (userPrototype === Admin.prototype) {
        userGroup = "Admin";
    }

    let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
        done(null,sessionConstructor);
    });

    passport.deserializeUser(function (sessionConstructor, done) {
        if (sessionConstructor.userGroup == 'User') {
            User.findOne({
                _id: sessionConstructor.userId
            }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
                done(err, user);
            });
        } else if (sessionConstructor.userGroup == 'Admin') {
            Admin.findOne({
                _id: sessionConstructor.userId
            }, '-localStrategy.password', function (err, admin) { // When using string syntax, prefixing a path with - will flag that path as excluded.
                done(err, admin);
            });
        }
    });
};
