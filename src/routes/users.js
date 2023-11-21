const express = require('express');
const passport = require('passport');
const User = require('../models/users');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('users/login', {
        title: 'Авторизация'
    });
});

router.get('/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/api/user/login');
    }

    res.render('users/profile', {
        title: 'Профиль',
        username: req.user.username
    })
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/user/me',
    failureRedirect: '/api/user/login',
}));

router.get('/signup', (req, res) => {
    res.render('users/signup', {
        title: 'Регистрация'
    });
})

router.post('/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.redirect('/api/user/login');
        }

        const user = new User({ username, password, email });
        await user.save();

        res.redirect('/api/user/me');
    } catch (error) {
        console.error("Ошибка регистрации:", error);
        res.redirect('/api/user/signup');
    }
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/api/user/login');
    });
});

module.exports = router;
