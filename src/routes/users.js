const express = require('express');
const passport = require('passport');
const User = require('../models/users');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    res.render('users/profile', {
        username: req.user.username
    })
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/me',
    failureRedirect: '/login',
}));

router.get('/signup', (req, res) => {
    res.render('users/signup');
})

router.post('/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.redirect('/login');
        }

        const user = new User({ username, password, email });
        await user.save();

        res.redirect('/me');
    } catch (error) {
        res.redirect('/signup');
    }
});

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

module.exports = router;
