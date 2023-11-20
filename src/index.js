const express = require('express');
const getBooksRouter = require('./routes/books');
const path = require('path');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000 ;
const UrlDB = process.env.UrlDB || 'mongodb://root:example@mongo:27017/library';

const app = express();

app.use('/static', express.static(path.join(__dirname, 'views', 'includes'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api', getBooksRouter);

app.post('/api/user/login', (req, res) => {
    const { users } = store;

    res.status(201).json(users);
});

async function start(PORT, UrlDB) {
  try {
    await mongoose.connect(UrlDB, {
      dbName: "books"
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start(PORT, UrlDB);