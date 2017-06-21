const route = require('express').Router();
const passport = require('../../auth/passport');

// const route = router();

route.use(passport.authenticate('bearer'));
route.use('/events', require('./events'));

module.exports = route;