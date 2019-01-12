const express = require('express');
const router = express.Router();
const User = require('../models/user');
router.get('', (req, res) => {
  User.find()
    .then((foundUser) => {
      res.json(foundUser);
    })
    .catch(e => console.error(`Error ${e}`));
});



router.get('/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((foundUser) => {
      res.json(foundUser);
    })
    .catch(e => {
      console.log(`Error ${e}`);
      res.status(422).send({title: 'User Error', detail: 'Could not find User'})
    });
});

router.post('/auth', (req, res) => {

});

router.post('/register', (req, res) => {

});

module.exports = router;
