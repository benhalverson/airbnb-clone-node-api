const Booking = require('../models/booking');
const Rental = require('../models/rental');
const User = require('../models/user');
const CUSTOMER_SHARE = 0.8;
const {
  normalizeErrors
} = require('../helpers/mongoose');
const moment = require('moment');
const config = require('../config');
const stripe = require('stripe')(config.STRIPE_SK);

exports.createBooking = (req, res) => {
  const {
    startAt,
    endAt,
    totalPrice,
    guests,
    days,
    rental,
    paymentToken
  } = req.body;
  const user = res.locals.user;

  const booking = new Booking({
    startAt,
    endAt,
    totalPrice,
    guests,
    days
  });

  Rental.findById(rental._id)
    .populate('bookings')
    .populate('user')
    .exec(async (err, foundRental) => {
      if (err) {
        return res.status(422).send({
          errors: normalizeErrors(err.errors)
        });
      }

      if (foundRental.user.id === user.id) {
        return res.status(422).send({
          errors: [{
            title: 'Invalid user',
            detail: 'Cannot create booking on your rental'
          }]
        });
      }

      if (isValidBooking(booking, foundRental)) {
        booking.user = user;
        booking.rental = foundRental;
        foundRental.bookings.push(booking);

        const {
          payment,
          err
        } = await createPayment(booking, foundRental.user, paymentToken);

        if (payment) {
          booking.payment = payment;
          booking.save((err) => {
            if (err) {
              return res.status(422).send({
                errors: normalizeErrors(err.errors)
              });
            }

            //save stuff to db
            foundRental.save();
            User.update({
              _id: user.id
            }, {
              $push: {
                bookings: booking
              }
            }, () => {});
            return res.json({
              startAt: booking.startAt,
              endAt: booking.endAt
            });
          });
        } else {
          //error :-(
          return res.status(422).send({
            errors: [{
              title: 'Payment Error',
              detail: err
            }]
          });
        }
      } else {
        // another error :-(
        return res.status(422).send({
          errors: [{
            title: 'Invalid Booking',
            detail: 'Choosen dates are already taken'
          }]
        });
      }
    });
}

exports.getUserBookings = (req, res) => {
  const user = res.locals.user;

  Booking
    .where({
      user
    })
    .populate('rental')
    .exec((err, foundBookings) => {
      if (err) {
        return res.status(422).send({
          errors: normalizeErrors(err.errors)
        });
      }
      return res.json(foundBookings);
    });
}

function isValidBooking(proposedBooking, rental) {
  let isValid = true;
  if (rental.bookings && rental.bookings.length > 0) {
    isValid = rentals.bookings.every((booking) => {
      const proposedStart = moment(proposedBooking.startAt);
      const proposedEnd = moment(proposedBooking.endAt);
      const actualStart = moment(booking.startAt);
      const actualEnd = moment(booking.endAt);

      return ((actualStart < proposedStart && actualEnd < proposedStart) || (proposedEnd < actualEnd && proposedEnd < actualStart));

    }); 
  }
  return isValid;
}

async function createPayment(booking, toUser, token) {
  const { user } = booking;

  const customer = await stripe.customers.create({
    source: token.id,
    email: user.email
  });

  if(customer) {
    User.update({_id: user.id}, {$set: {stripeCustomerId: customer.id}}, () => {});

    const payment = new PaymentAddress({
      fromUser: user,
      toUser,
      stripeCustomerId: customer.id,
      booking,
      tokenId: token.id,
      amount: booking.totalPrice * 100 * CUSTOMER_SHARE
    });

    try {
      const savePayment = await payment.save();
      return {payment: savePayment};
    } catch(err) {
      return {err: err.message};
    }
  } else {
    return {err: 'Cannot process payment'}
  }
}