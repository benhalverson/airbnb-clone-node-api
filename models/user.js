const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    min: [4, 'too short...'],
    max: [32, 'too long...']
  },
  email: {
    type: String,
    min: [4, 'too short...'],
    max: [32, 'too long...'],
    lowercase: true,
    unique: true,
    required: 'Email is required',
  },
  password: {
    type: String,
    min: [4, 'too short...'],
    max: [32, 'too long...'],
    required: 'Password is required'
  },
  rentals: [{
    type: Schema.Types.ObjectId, ref: 'Rental'
  }]
});

module.exports = mongoose.model('User', userSchema);