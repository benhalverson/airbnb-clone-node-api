const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');
const {
  normalizeErrors
} = require('../helpers/mongoose');
exports.auth = (req, res) => {
  const {
    email,
    password
  } = req.body;
  if (!password || !email) {
    return res.status(422).send({
      errors: [{
        title: 'Data missing',
        detail: 'Provide email and password'
      }]
    });
  }


  User.findOne({
      email
    }).then((user) => {
      if (!user) {
        return res.status(422).send({
          errors: [{
            title: 'Invalid user',
            detail: 'User does not exist'
          }]
        });
      }
      if (user.hasSamePassword(password)) {
        //return jwt token
        const token = jwt.sign({
          userId: user.id,
          username: user.username
        }, config.SECRET, {
          expiresIn: '1h'
        });
        return res.json(token);
      } else {
        return res.status(422).send({
          errors: [{
            title: 'Invalid',
            detail: 'Wrong user name or password'
          }]
        });
      }
    })
    .catch(err => {
      console.log(`Error ${err.message}`);
    })
}

exports.register = (req, res) => {
  const {
    username,
    email,
    password,
    passwordConfirmation
  } = req.body;

  if (!password || !email) {
    return res.status(422).send({
      errors: [{
        title: 'Data missing!',
        detail: 'Provide email and password!'
      }]
    });
  }

  if (password !== passwordConfirmation) {
    return res.status(422).send({
      errors: [{
        title: 'Invalid passsword!',
        detail: 'Password is not a same as confirmation!'
      }]
    });
  }

  User.findOne({
    email
  }, (err, existingUser) => {
    if (err) {
      return res.status(422).send({
        errors: normalizeErrors(err.errors)
      });
    }

    if (existingUser) {
      return res.status(422).send({
        errors: [{
          title: 'Invalid email!',
          detail: 'User with this email already exist!'
        }]
      });
    }

    const user = new User({
      username,
      email,
      password
    });

    user.save((err) => {
      if (err) {
        return res.status(422).send({
          errors: normalizeErrors(err.errors)
        });
      }

      return res.json({
        'registered': true
      });
    })
  })
}