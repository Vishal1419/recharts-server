const mongoose = require('mongoose');
const { DB_CONNECTION_STRING } = require('./config');

mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
