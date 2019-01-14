const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const Rental = require('./models/rental');
const User = require('./models/user');
const rentalRoutes = require('./routes/rentals');
const userRoutes = require('./routes/users');
const FakeDb = require('./fake-db');
const app = express();
mongoose.Promise = Promise;  
mongoose.connect('mongodb://localhost:27017/airbnb-clone')
  .then(() => {
    const fakeDB = new FakeDb();
    fakeDB.seedDB();
  })
  .catch(e => console.error(`Error ${e}`));

app.use(bodyParser.json());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rentals', rentalRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  `listening on ${PORT}`;
});