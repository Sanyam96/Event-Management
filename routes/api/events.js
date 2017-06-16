const router = require('express').Router;

const route = router();

route.get('/', (req, res) => {
	res.send("Get Array of Events");
});

route.post('/new', (req, res) => {
	res.send("Post add new events")
});