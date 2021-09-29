'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// set up mongoose
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (error) => console.error(error));
mongoose.connection.once('open', () => console.log('connected'));

const BookModel = require('./models/book.js');
const Book = require('./models/book.js');


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/test', (request, response) => {

  response.send('test request received')

})

app.get('/books', async (request, response) => {
  const filterQuery = {};
  if (request.query.email) {
    filterQuery.email = request.query.email;
  }

  const books = await Book.find(filterQuery);

  response.send(books);
});

app.post('/books', async (request, response) => {
  const newBook = await Book.create({ ...request.body, email: request.query.email });
  response.send(newBook);
});

app.delete('/books/:id', async (request, response) => {

  // if email sent on query then....
  if (request.query.email) {
    // get the book that matches id AND email
    const foundBook = await Book.findOne({ _id: request.params.id, email: request.query.email });

    // only delete if found

    console.log({ foundBook });

    // const deleteResult = await Book.findByIdAndDelete(request.params.id);

    if (foundBook) {
      const deleteResult = await Book.findByIdAndDelete(request.params.id);
      console.log({ deleteResult });
      response.status(204).send('success');
    } else {
      response.status(400).send('You cannot delete that book'); // correct status code???
    }

  } else {
    response.status(403).send('You must be logged in');
  }
});



app.listen(PORT, () => console.log(`listening on ${PORT}`));
