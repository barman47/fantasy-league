const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'User Signup',
        style: 'signup.css',
        script: 'signup.js'
    });
});

router.post('/register', (req, res) => {
    const body = req.body;
    const newUser = {
        name: body.name,
        username: body.username,
        password: body.password,
        confirmPassword: body.confirmPassword
    };
    
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match!').equals(newUser.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            title: 'User Signup',
            style: 'signup.css',
            script: 'signup.js',
            errors: errors,
            name: newUser.name,
            username: newUser.name,
            password: newUser.password,
            confirmPassword: newUser.confirmPassword
        });
    } else {
        let user = new User({
            name: newUser.name,
            username: newUser.username,
            password: newUser.password
        });

        User.findOne({username: user.username}, (err, returnedUser) => {
            if (err) {
                return console.log(err);
            } else if (returnedUser) {
                res.render('register', {
                    title: 'User Signup',
                    style: 'signup.css',
                    script: 'signup.js',
                    error: 'User already exists',
                    name: newUser.name,
                    username: newUser.name,
                    password: newUser.password,
                    confirmPassword: newUser.confirmPassword
                });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        return console.log(err);
                    }
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) {
                            return console.log(err);
                        }
                        user.password = hash;
                        user.save((err) => {
                            if (err) {
                                return console.log(err);
                            } else {
                                req.flash('success', 'Registration Successful. You can now proceed and login.');
                                res.redirect('/users/login');
                            }   
                        });
                    });
                });
            }
        });
    }
});

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'User login',
        style: 'login.css'
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('user', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('failure', 'Incorrect Username or Password.');
            return res.redirect('/users/login');
        }

        req.logIn(user, (err) => {
            res.send('You are logged in');
            // let id = user._id;
            // id = mongoose.Types.ObjectId(id); 
            // res.redirect(`/users/dashboard/${id}`);
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out.');
    res.redirect('/');
});

module.exports = router;