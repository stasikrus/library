const express = require('express');
const router = express.Router();

router.get('/books', (req, res) => {
    const { books } = store;

    res.render('index', {
        title: 'Books',
        books: books
    })
});