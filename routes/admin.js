const express = require('express');
const mongoose = require('mongoose');
const Admin = require('../models/admin');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/register', (req, res) => {
    const body = req.body;
    const newAdmin = {
        name: body.name,
        username: body.username,
        password: body.password,
        secret: body.secret
    };
    
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('secret', 'Incorrect Secret Key!').equals('yousee');

    let signupErrors = req.validationErrors();

    if (signupErrors) {
        res.render('index', {
            title: 'User Signup',
            style: 'index.css',
            script: 'index.js',
            signupErrors,
            name: newAdmin.name,
            username: newAdmin.name,
            password: newAdmin.password,
            secret: newAdmin.secret
        });
    } else {
        let admin = new Admin({
            name: newAdmin.name,
            username: newAdmin.username,
            password: newAdmin.password
        });

        Admin.findOne({username: admin.username}, (err, returnedAdmin) => {
            if (err) {
                return console.log(err);
            } else if (returnedAdmin) {
                res.render('index', {
                    title: 'User Signup',
                    style: 'signup.css',
                    script: 'signup.js',
                    error: 'Admin already exists',
                    name: newAdmin.name,
                    username: newAdmin.name,
                    password: newAdmin.password,
                    secret: newAdmin.secret
                });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        return console.log(err);
                    }
                    bcrypt.hash(admin.password, salt, (err, hash) => {
                        if (err) {
                            return console.log(err);
                        }
                        admin.password = hash;
                        admin.save((err) => {
                            if (err) {
                                return console.log(err);
                            } else {
                                req.flash('success', 'Admin Registration Successful. You can now proceed and login.');
                                res.redirect('/');
                            }   
                        });
                    });
                });
            }
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('admin', (err, admin, info) => {
        if (err) {
            return next(err);
        }
        if (!admin) {
            req.flash('failure', 'Incorrect Username or Password.');
            return res.redirect('/');
        }

        req.logIn(admin, (err) => {
            let id = admin._id;
            id = mongoose.Types.ObjectId(id); 
            res.redirect(`/admins/dashboard/${id}`);
        });
    })(req, res, next);
});

router.get('/dashboard/:id', (req, res) => {
    let query = {_id: req.params.id};
    Admin.findOne(query, (err, admin) => {
        if (err) {
            return console.log(err);
        } else {
            res.render('adminDashboard', {
                admin
            }); 
        }
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out.');
    res.redirect('/');
});

module.exports = router;