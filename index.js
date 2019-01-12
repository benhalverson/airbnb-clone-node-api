const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();

mongoose.connect(config.DB_URI);
app.get('/rentals', (req, res) => {
  res.json({'success': true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  `listening on ${PORT}`;
});