const router = require('express').Router;

const route = router();

route.use('/events', require('./events'));

module.exports = route;