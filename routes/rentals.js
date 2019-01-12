const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
router.get('', (req, res) => {
  Rental.find()
    .then((foundRental) => {
      res.json(foundRental);
    })
    .catch(e => console.error(`Error ${e}`));
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Rental.findById(id)
    .then((foundRental) => {
      res.json(foundRental);
    })
    .catch(e => {
      console.log(`Error ${e}`);
      res.status(422).send({title: 'Rental Error', detail: 'Could not find Rental'})
    });
})

module.exports = router;
