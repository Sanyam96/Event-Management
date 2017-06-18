const route = require('express').Router();
const user = require('../db/models').User;
const passport = require('../auth/passport');
const eli = require('../auth/utils').eli;


route.post('/signup', (req, res) => {
		User.create( {
			username : req
					    .body
					    .username,

			email : req
					 .body
					 .email,

			password : req
						.body
						.password
		})
		.then( (user) => {
			res.redirect('/login.html')
		})
});

route.post('/login', passport.authenticate('local', {
	successRedirect : '/profile',
	failureRedirect : '/login.html'
}));

route.get('/profile', eli('/login.html'), (req, res) => {
	res.send(req.user);
});

module.export = route;