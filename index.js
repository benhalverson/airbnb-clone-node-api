const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const config = require('./config');
const rentalRoutes = require('./routes/rentals');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment');
const imageUploadRoutes = require('./routes/image-upload');
const app = express();
mongoose.Promise = Promise;
mongoose.set('useCreateIndex', true);
const db = async () => {
	try {
	  console.log('db connected');
		await mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
	} catch (e) {
		console.error(`Connection Error: ${e.name}`);
	}
};
db();
app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));
// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', imageUploadRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	`listening on ${PORT}`;
});
