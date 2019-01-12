const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const Rental = require('./models/rental');
const FakeDb = require('./fake-db');
const app = express();

mongoose.connect(config.DB_URI)
  .then(() => {
    const fakeDB = new FakeDb();
    fakeDB.seedDB();
  })
  .catch(e => console.error(`Error ${e}`));


app.get('/rentals', (req, res) => {
  res.json({'success': true});
});
app.get('/rentals/:id', (req, res) => {
  const id = req.params.id;
  Rental.findById(id, (err, foundRental) => {
    res.json(foundRental);
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  `listening on ${PORT}`;
});