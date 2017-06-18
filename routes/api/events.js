const router = require('express').Router;
const route = router();
const Event = require('../../db/models').Event;


route.get('/', (req, res) => {
	// res.send("Get Array of Events");
	Event
		.findAll()
		.then((events) => {
			res
			   .status(200)
			   .send(events)
		})
		.catch((err) => {
			console.log(err);
			res
			.status(500)
			.send("Error in retrieving events")
		})
});

route.post('/new', (req, res) => {
	// res.send("Post add new events")
	if(!req.body.title){
		return res
			   .status(403)
			   .send('Event cannot created without Title.. Please add Title to event!!')
	}

	// Date format expected from frontend
	// YYYY-MM-DD'T'HH:MM
	Event
	.create( {
		title : req.body.title,
		venue : req.body.venue,
		imgUrl : req.body.imgUrl,
		startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
        message: req.body.message,
	})
	.then((event) => {
		res
		.status(200)
		.send(event)
	})
	.catch((err) => {
		res
		.status(500)
		.send("There was an error creating event")
	})
});

route.get('/:id', (req, res) => {
    Event
    	.findByPrimary(req.params.id)
        .then((event) => {
            if (!event) {
                return res
                		.status(500)
                		.send("No such event found")
            }
            res
            .status(200)
            .send(event);
        })
        .catch((err) => {
            res
            .status(500)
            .send('Error finding event')
        })
});

module.export = route;