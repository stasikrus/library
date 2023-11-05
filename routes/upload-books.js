const express = require('express');
const router = express.Router();
const fileMulter = require('../middleware/file');
const store = require('../store/store');
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

router.post('/',
  fileMulter.single('file-book'),
  (req, res) => {
    if (req.file) {
      const { path, filename  } = req.file;
        const {title, description, authors, favorite, fileCover} = req.body;
        const { books } = store;
        console.log(filename)
        const newBook = new Book(title, description, authors, favorite, fileCover, filename, path);

        books.push(newBook);
        res.status(201).json(newBook);
    } else {
        res.status(400).send('File was not uploaded');
    }
});


module.exports = router;