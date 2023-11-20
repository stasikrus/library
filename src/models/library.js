const { Schema, model } = require('mongoose');

const librarySchema = new Schema({
    id: String,        
    title: String,
    description: String,
    authors: String,
    favorite: String,
    fileCover: String,
    fileName: String,
    fileData: Buffer
});

module.exports = model('Library', librarySchema);
