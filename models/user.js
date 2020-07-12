const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters']
  },
  email: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters'],
    unique: true,
    lowercase: true,
    required: 'Email is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters'],
    required: 'Password is required'
  },
  stripeCustomerId: String,
  revenue: Number,
  rentals: [{ type: Schema.Types.ObjectId, ref: 'Rental' }],
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }]
});

userSchema.methods.hasSamePassword = (requestedPassword) => {
  console.log('request password', requestedPassword);
  console.log('this.password', this.password);
    return bcrypt.compareSync(requestedPassword, this.password);
}


userSchema.pre('save', (next) => {
  const user = this;
  console.log('user', this.username);
  bcrypt.genSalt(10, (err, salt) => {
    console.log('generate salt', salt);
    if(err) {
      console.log('genSalt error', err);
    }
    bcrypt.hash(this.password, salt, (err, hash) => {
      debugger;
      console.log('password', this.password);
      console.log('salt', salt);
      console.log('hash', hash);
      if(err) {
        console.log('hash error', err);
      }
      this.password = hash;
      console.log('user.pass = hash', this.password);
      next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);