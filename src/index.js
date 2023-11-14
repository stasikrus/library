const express = require('express');
const getBooksRouter = require('./routes/books');
const path = require('path');

const PORT = process.env.PORT || 3000 ;

const app = express();

app.use('/api', express.static(path.join(__dirname, 'views', 'includes'), {
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});