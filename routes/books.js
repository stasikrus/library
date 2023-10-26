const express = require('express');
const router = express.Router();
const fileMulter = require('../middleware/file');

router.post('/books',
  fileMulter.single('cover-file'),
  (req, res) => {
    if (req.file) {
        const { path } = req.file;
        res.json({path});
    }

    res.json();
})

module.exports = router;