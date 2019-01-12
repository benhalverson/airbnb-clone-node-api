const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const Rental = require('./models/rental');
const rentalRoutes = require('./routes/rentals');

const FakeDb = require('./fake-db');
const app = express();
mongoose.Promise = Promise;  
mongoose.connect(config.DB_URI)
  .then(() => {
    const fakeDB = new FakeDb();
    fakeDB.seedDB();
  })
  .catch(e => console.error(`Error ${e}`));


app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/rentals/:id', rentalRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  `listening on ${PORT}`;
});