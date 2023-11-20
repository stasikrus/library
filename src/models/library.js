const { Schema, model } = require('mongoose');

const librarySchema = new Schema({      
    title: String,
    description: String,
    authors: String,
    favorite: Boolean,
    fileCover: String,
    fileName: String,
    fileData: Buffer
});

module.exports = model('Library', librarySchema);
