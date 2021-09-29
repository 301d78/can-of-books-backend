const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: String,
  email: String,
  description: String,
  status: String,
});

const Book = mongoose.model('Book', schema);

module.exports = Book;