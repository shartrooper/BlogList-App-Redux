const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blog');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const config = require('./utils/config');

console.log('connecting to', config.MONGODB_URI);

const serverConnected = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    console.log('connected to mongo DataBase');
  } catch (error) { console.log('error connection to MongoDB:', error.message); }
};

serverConnected();

app.use(cors());
// app.use(express.static('build'))
app.use(bodyParser.json());
app.use(middleware.requestLogger);

app.use(middleware.tokenExtractor);
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);


app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
