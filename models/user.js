const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
userSchema.methods.hasSamePassword = (requestedPassword) => {
  return bcrypt.compareSync(requestedPassword, this.password);
}
userSchema.pre('save', (next) => {
  const user = this;
  const saltRounds = 10;
  const minor = 'b'
  debugger;
  bcrypt.genSalt(saltRounds, minor)
    .then((hash) => {
    // Store hash in your password DB.
    console.log('promise 1', hash);
    return bcrypt.hash(hash, saltRounds)
      .then((hash) => {
        console.log('promise 2', user.hash);
        console.log('username', user)
        user.password = hash;
        next();
      })
      .catch(err => {
        console.error(`Failed to save to DB ${err}`);
      });
  }).catch(err => {
    console.error(`Failed to encrypt ${err}`);
  });
});

module.exports = mongoose.model('User', userSchema);