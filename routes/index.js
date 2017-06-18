const route = require('express').Router();
const user = require('../db/models').User;



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

module.export = route;