const User = require('../models/user');
const Booking = require('../models/booking');
const Rental = require('../models/rental');
const Payment = require('../models/payment');
const {
  normalizeErrors
} = require('../helpers/mongoose');
const config = require('../config');

const stripe = require('stripe')(config.STRIPE_SK);

exports.getPendingPayments = (req, res) => {
  const user = res.locals.user;

  Payment
    .where({
      toUser: user
    })
    .populate({
      path: 'booking',
      populate: {
        path: 'rental'
      },
    })
    .populate('fromUser')
    .exec((err, foundPayment) => {
      if (err) {
        return res.status(422).send({
          errors: normalizeErrors(err.errors)
        });
      }
      return res.json(foundPayment);
    });
}

exports.confimPayment = (req, res) => {
  const payment = req.body;
  const user = res.locals.user;

  Payment
    .findById(payment._id)
    .populate('toUser')
    .populate('booking')
    .exec(async (err, foundPayment) => {
      if (err) {
        return res.status(422).send({
          errors: normalizeErrors(err.errors)
        });
      }

      if (foundPayment.status === 'pending' && user.id === foundPayment.toUser.id) {
        const booking = foundPayment.booking;
        const charge = await stripe.charge.create({
          amount: booking.totalPrice * 100,
          currency: 'usd',
          customer: payment.fromStripeCustomerId
        })

        if (charge) {
          Booking.update({
            _id: booking
          }, {
            status: 'active'
          }, () => {});
          foundPayment.charge = charge;
          foundPayment.status = 'paid';

          foundPayment.save((err) => {
            if (err) {
              return res.status(422).send({
                errors: normalizeErrors(err.errors)
              });
            }

            User.update({
              _id: foundPayment.toUser
            }, {
              $inc: {
                revenue: foundPayment.amount
              }
            }, (err, user) => {
              if (err) {
                return res.status(422).send({
                  errors: normalizeErrors(err.errors)
                });
              }

              return res.json({
                status: 'paid'
              });
            });
          });
        }
      }
    });
}

exports.declinePayment = (req, res) => {
  const payment = req.body;
  const { booking } = payment;

  Booking.deleteOne({id: booking._id}, (err, deleteBooking) => {
    if (err) {
      return res.status(422).send({
        errors: normalizeErrors(err.errors)
      });
    }

    Payment.update({_id: payment._id}, {status: 'declined'}, () => {});
    Rental.update({_id: booking.rental}, { $pull: {bookings: booking._id}}, () => {});

    return res.json({status: 'declined'});
  });
}
