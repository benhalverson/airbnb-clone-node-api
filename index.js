const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const rentalRoutes = require('./routes/rentals');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/booking')
const FakeDb = require('./fake-db');
const app = express();
mongoose.Promise = Promise;  
mongoose.connect(config.DB_URI)
  .then(() => {
    const fakeDB = new FakeDb();
    fakeDB.seedDB();
  })
  .catch(e => console.error(`Error ${e}`));

app.use(bodyParser.json());

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/bookings', bookingRoutes);
// TODO
// app.use('/api/v1/payments', paymentRoutes);
// app.use('/api/v1', imageUploadRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  `listening on ${PORT}`;
});