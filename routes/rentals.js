const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const {
  normalizeErrors
} = require('../helpers/mongoose');

const UserController = require('../controllers/user');

router.get('/secret', UserController.authMiddleware, (req, res) => {
  res.json({
    'secret': true
  });
});

router.get('/manage', UserController.authMiddleware, (req, res) => {
  const user = res.locals.user;

  Rental
    .where({
      user
    })
    .populate('bookings')
    .exec((err, foundRentals) => {
      if (err) {
        return res.status(422).send({
          errors: normalizeErrors(err.errors)
        });
      }
      return res.json(foundRentals);
    })
});


router.get(':id/verify-user', UserController.authMiddleware, (req, res) => {
  const user = res.locals.user;

  Rental
    .findById(req.params.id)
    .populate('user')
    .exec((err, foundRental) => {
      if(err) {
        //stufff
      }

      if(foundRental.user.id !== user.id) {
        // invalid user
      }

      return res.json({status: 'verified'});
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Rental.findById(id)
    .then((foundRental) => {
      res.json(foundRental);
    })
    .catch(e => {
      console.log(`Error ${e}`);
      res.status(422).send({
        title: 'Rental Error',
        detail: 'Could not find Rental'
      })
    });
})

router.patch(':id', UserController.authMiddleware, (req, res) => {
  const rentalData = req.body;
  const user = res.locals.user;

  Rental
    .findById(req.params.id)
    .populate('user')
    .exec((err, foundRental) => {
      if(err) {
        // throw error
      }

      if(foundRental.user.id !== user.id) {
        // invalid user for rental
      }

      foundRental.set(rentalData);
      foundRental.save((err) => {
        if(err) {
          // another error
        }
        return res.status(200).send(foundRental);
      });
    });
});

router.delete(':id', UserController.authMiddleware, (req, res) => {
  const user = res.locals.user;

  Rental
    .findById(req.params.id)
    .populate('user', '_id')
    .populate({
      path: 'bookings',
      select: 'startAt',
      match: { startAt: { $gt: new Date() }}
    })
    .exec((err, foundRental) => {
      if(err) {
        // throw error
      }

      if(foundRental.user.id !== user.id) {
        // invalid user for rental
      }

      if(foundRental.bookings.length > 0) {
        // can not delete rental with active bookings
      }

      foundRental.remove((err) => {
        if(err) {
        // throw error   
        }

        return res.json({'status': 'deleted'});
      });
    });
});

router.post('', UserController.authMiddleware, (req, res) => {
  const { title, city, street, category, image, shared, bedrooms, description, dailyRate } = req.body;

  rental.user = user;

  Rental.create(rental, (err, newRental) => {
    if(err) {
      throw new Error(err)
    }

    User.update({_id: user.id}, { $push: {rentals: newRental}}, () => {});

    return res.json(newRental);
  });
});

router.get('', (req, res) => {
  const city = req.query.city;
  const query = city ? { city: city.toLowerCase()} : {};

  Rental.find(query)
    .select('-bookngs')
    .exec((err, foundRentals) => {
      if(err) {
        // throw error
      }

      if(city && foundRentals.length === 0) {
        // error no rentals for city ${city}
      }

      return res.json(foundRentals);
    });
})

module.exports = router;
