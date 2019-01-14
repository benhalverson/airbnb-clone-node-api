const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  startAt: { type: Date, required: 'starting date is required' },
  endAt: { type: Date, required: 'ending date is required' },
  totalPrice: Number,
  days: Number,
  guests: Number,
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  rental: { type: Schema.Types.ObjectId, ref: 'Rental' },
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  status: { type: Schema.Types.ObjectId, ref: 'pending' }
});

module.exports = mongoose.model('Booking', bookingSchema);