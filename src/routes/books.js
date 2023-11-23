const express = require('express');
const router = express.Router();
const fileMulter = require('../middleware/file');
const { incrementCounter, getCounter } = require('../utils/counter');
const Library = require('../models/library');

router.get('/books', async (req, res) => {
    try {
        const books = await Library.find().select('-__v');
        res.render('books/index', {
            title: 'Books',
            books: books
        });
    } catch (error) {
        res.status(500).json({ message: "Произошла ошибка при получении книг", error: error });
    }
});

router.get('/create', (req, res) => {
    res.render('books/create', {
        title: 'Create book',
        method: 'post',
        route: '/api/books',
        book: {}
    });
});

router.post('/books', fileMulter.single('file-book'), async (req, res) => {
    if (req.file) {
        const { title, description, authors, favorite, fileCover } = req.body;
        const newBook = new Library({
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName: req.file.originalname,
            fileData: req.file.buffer
        });

        try {
            await newBook.save();
            res.status(201).json(newBook);
        } catch (error) {
            res.status(500).json({ message: "Произошла ошибка при сохранении книги", error: error });
        }
    } else {
        res.status(400).send('Файл книги не был загружен');
    }
});

router.get('/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Library.findById(id).select('-__v');
        if (book) {
            await incrementCounter(id);
            const bookCounter = await getCounter(id);

            res.render('books/view', {
                title: `Book | ${book.title}`,
                book: book,
                counter: bookCounter,
                isAuthenticated: req.isAuthenticated()
            });
        } else {
            res.status(404).redirect('/404');
        }
    } catch (error) {
        res.status(500).json({ message: "Произошла ошибка при получении книги", error: error });
    }
});
    

router.get('/update/:id', async (req, res) => {
    const { id } = req.params;

    const book = await Library.findById(id);

    if (book) {
        res.render('books/update', {
            title: `Book | Update ${book.title}`,
            method: 'put',
            route: `/books/${book.id}`,
            book: book
        });
    } else {
        res.status(404).redirect('/404');
    }
});

router.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, authors, favorite, fileCover, fileName } = req.body;

    try {
        await Library.findByIdAndUpdate(id, {
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName
        });

        res.redirect('/');
    } catch (error) {
        res.status(500).json({ message: "Произошла ошибка при обновлении книги", error: error });
    }
});

router.delete('/delete/books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Library.deleteOne({_id: id});
        res.status(200).json('ok')
    } catch (error) {
        res.status(500).json({ message: "Произошла ошибка при удалении книги", error: error });
    }
});


module.exports = router;
