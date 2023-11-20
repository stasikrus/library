const express = require('express');
const router = express.Router();
const fileMulter = require('../middleware/file');
const { v4: uuidv4 } = require('uuid');
const { incrementCounter, getCounter } = require('../utils/counter');
const Library = require('../models/library');
const fs = require('fs');

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

const testBook = new Book(
    "Test Book Title",
    "Description of Test Book",
    "Test Author",
    false,
    "path/to/cover.jpg",
    "test-book.pdf",
    "path/to/test-book.pdf"
);

const store = {
    books: [testBook],
    users: { 
        id: 1, mail: "test@mail.ru" 
    }
};

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

router.post('/books',
    fileMulter.single('file-book'),
    async (req, res) => {
        if (req.file) {
            const { path, filename } = req.file;
            const { title, description, authors, favorite, fileCover } = req.body;

            // Логирование пути файла
            console.log("File path:", path);

            // Проверка существования файла
            if (fs.existsSync(path)) {
                console.log("File exists.");
                const fileData = fs.readFileSync(path);

                const newBook = new Library({
                    title,
                    description,
                    authors,
                    favorite,
                    fileCover,
                    fileName: filename,
                    fileData
                });

                try {
                    await newBook.save();
                    res.status(201).json(newBook);
                } catch (error) {
                    // Логирование ошибки при сохранении
                    console.error("Error saving the book:", error);
                    res.status(500).json({ message: "Произошла ошибка при сохранении книги", error: error });
                }
            } else {
                console.log("File does not exist.");
                res.status(400).send('Файл книги не найден');
            }
        } else {
            res.status(400).send('Файл книги не был загружен');
        }
    }
);

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
                counter: bookCounter
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
