const express = require('express');
const { v4: uuidv4 } = require('uuid');

class Book {
    constructor(title, description, authors, favorite, fileCover, fileName) {
        this.id = uuidv4();
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
    }
}

const store = {
    books: [],
    users: { 
        id: 1, mail: "test@mail.ru" 
    }
};

const PORT = process.env.PORT || 3000 ;

const app = express();

app.use(express.json());

app.post('/api/user/login', (req, res) => {
    const { users } = store;

    res.status(201).json(users);
});

app.post('/api/books', (req, res) => {
    const {books} = store;
    const {title, description, authors, favorite, fileCover, fileName} = req.body;
    const newBook = new Book(title, description, authors, favorite, fileCover, fileName);

    books.push(newBook);

    res.status(201).json(newBook);
});

app.get('/api/books', (req, res) => {
    const { books } = store;
    res.json(books);
});

app.get('/api/books/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const index = books.findIndex(el => el.id === id);

    if (index !== -1) {
        res.json(books[index]);
    } else {
        res.status(404).json('404 | Not found');
    }
});

app.put('/api/books/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;

    const index = books.findIndex(el => el.id === id);

    if (index !== -1) {
        books[index] = {...books[index], ...req.body};

        res.json(books[index]);
    } else {
        res.status(404).json('404 | Not found');
    }
});

app.delete('/api/books/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;

    const index = books.findIndex(el => el.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        res.json('ok');
    } else {
        res.status(404).json('404 | Not found');
    }
});

app.listen(PORT);