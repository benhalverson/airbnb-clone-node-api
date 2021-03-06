const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');

//Middleware to get single user by ID
exports.getUser = (req, res) => {
	const requestedUserId = req.params.id;
	const user = res.locals.user;

	if (requestedUserId === user.id) {
		User.findById(requestedUserId, (err, foundUser) => {
			if (err) {
				return res.status(422).send({ errors: normalizeErrors(err.errors) });
			}

			return res.json(foundUser);
		});
	} else {
		User.findById(requestedUserId).select('-revenue -stripeCustomerId -password').exec((err, foundUser) => {
			if (err) {
				return res.status(422).send({ errors: normalizeErrors(err.errors) });
			}

			return res.json(foundUser);
		});
	}
};

//Middleware to authenticate a username and password
exports.auth = (req, res) => {
	const { email, password } = req.body;

	if (!password || !email) {
		return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'Provide email and password!' }] });
	}

	User.findOne({ email }, (err, user) => {
		if (err) {
			return res.status(422).send({ errors: normalizeErrors(err.errors) });
		}

		if (!user) {
			return res.status(422).send({ errors: [{ title: 'Invalid User!', detail: 'User does not exist' }] });
		}

		if (user.hasSamePassword(password)) {
			console.log('password', password);
			console.log('token', token);
			const token = jwt.sign(
				{
					userId: user.id,
					username: user.username,
					password: user.password
				},
				config.SECRET,
				{ expiresIn: '1h' }
			);
			console.log('token', token);
			return res.json(token);
		} else {
			return res.status(422).send({ errors: [{ title: 'Wrong Data!', detail: 'Wrong email or password' }] });
		}
	});
};

exports.register = (req, res) => {
	const { username, email, password, passwordConfirmation } = req.body;
	console.log('register ==========');
	console.log(req.body.username)
	console.log(req.body.email)
	console.log(req.body.password)
	console.log(req.body.passwordConfirmation)
	console.log('register ==========');
	if (!password || !email) {
		console.log('hey')
		return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'Provide email and password!' }] });
	}

	if (password !== passwordConfirmation) {
		console.log('hi');
		return res
			.status(422)
			.send({ errors: [{ title: 'Invalid passsword!', detail: 'Password is not a same as confirmation!' }] });
	}

	User.findOne({ email }, (err, existingUser) => {
		if (err) {
			return res.status(422).send({ errors: normalizeErrors(err.errors) });
		}

		if (existingUser) {
			return res
				.status(422)
				.send({ errors: [{ title: 'Invalid email!', detail: 'User with this email already exist!' }] });
		}

		const user = new User({
			username,
			email,
			password
		});
		console.log('reg', username, email, password);
		// user.save();
		// user.then(() => {
		// 		return res.json({ registered: true });
		// 	})
		// 	.catch((err) => {
		// 		return res.status(422).send({ errors: normalizeErrors(err.errors) });
		// 	});
		user.save((err) => {
			console.log('error', err);
			if (err) {
				return res.status(422).send({ errors: normalizeErrors(err.errors) });
			}

			return res.json({ registered: true });
		});
	});
};

exports.authMiddleware = (req, res, next) => {
	const token = req.headers.authorization;
	debugger;
	if (token) {
		const user = parseToken(token);

		User.findById(user.userId, (err, user) => {
			if (err) {
				return res.status(422).send({ errors: normalizeErrors(err.errors) });
			}

			if (user) {
				res.locals.user = user;
				next();
			} else {
				return notAuthorized(res);
			}
		});
	} else {
		return notAuthorized(res);
	}
};

function parseToken(token) {
	return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorized(res) {
	return res
		.status(401)
		.send({ errors: [{ title: 'Not authorized!', detail: 'You need to login to get access!' }] });
}
