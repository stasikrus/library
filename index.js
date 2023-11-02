const express = require('express');
const store = require('./store/store');
const uploadBooksRouter = require('./routes/books');

const PORT = process.env.PORT || 3000 ;

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');

app.use('/api/books', uploadBooksRouter);

app.post('/api/user/login', (req, res) => {
    const { users } = store;

    res.status(201).json(users);
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

app.get('/api/books/:id/download', (req, res) => {
    const { id } = req.params;
    const book = store.books.find(book => book.id === id);
    
    if (book && book.fileBook) {
        res.download(book.fileBook)
    } else {
        res.status(404).send('Book or file not found');
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