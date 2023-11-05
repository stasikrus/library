const express = require('express');
const router = express.Router();
const fileMulter = require('../middleware/file');
const { v4: uuidv4 } = require('uuid');

class Book {
    constructor(title, description, authors, favorite, fileCover, fileName, fileBook) {
        this.id = uuidv4();
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
}

const store = {
    books: [],
    users: { 
        id: 1, mail: "test@mail.ru" 
    }
};

router.get('/books', (req, res) => {
    const { books } = store;
    res.render('books/index', {
        title: 'Books',
        books: books
    });
});

router.get('/create', (req, res) => {
    res.render('books/create', {
        title: 'Create book',
        book: {}
    });
});

router.post('/books',
    fileMulter.single('file-book'),
    (req, res) => {
        if (req.file) {
            const { path, filename } = req.file;
            const { title, description, authors, favorite, fileCover } = req.body;
            const { books } = store;
            const newBook = new Book(title, description, authors, favorite, fileCover, filename, path);
            books.push(newBook);
            res.status(201).redirect('/');
        } else {
            res.status(400).send('File was not uploaded');
        }
    });

router.get('/books/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const book = books.find(book => book.id === id);

    if (book) {
        res.render('books/view', {
            title: `Book | ${book.title}`,
            book: book
        });
    } else {
        res.redirect('/404');
    }
});

router.get('/update/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const book = books.find(book => book.id === id);

    if (book) {
        res.render('books/update', {
            title: `Book | Update ${book.title}`,
            book: book
        });
    } else {
        res.redirect('/404');
    }
});

router.put('/books/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body;

    const index = books.findIndex(book => book.id === id);

    if (index !== -1) {
        const updatedBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook);
        books[index] = updatedBook;
        res.json(updatedBook);
    } else {
        res.status(404).json('Book not found');
    }
});

router.delete('/delete/books/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;

    const index = books.findIndex(book => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        res.json('ok');
    } else {
        res.status(404).json('Book not found');
    }
});

module.exports = router;
