const route = require('express').Router();
const Event = require('../../db/models').Event;
const User = require('../../db/models').User;
const EventInvitee = require('../../db/models').EventInvitee;
const Invitee = require('../../db/models').Invitee;
const authUtils = require('../../auth/utils');

// GET
route.get('/', (req, res) => {
	// res.send("Get Array of Events");
	console.log(req.user);
	Event
		.findAll({
			attributes : ['id', 'title', 'startTime', 'endTime', 'venue', 'hostId'],
		})
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

// POST
route.post('/new', (req, res) => {
	// ToDo Add Server-Side validations if required!!
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
        hostId : req.body.id
	})
	.then((event) => {
		res
			.status(200)
			.send(event)

		if(req.body.invitees) {
			let invitees = req.body.invitees.split(';');
			invitees = invitees.map((i) => {
				return {
					email: i.trim()
				}
			});
			Invitee
				.bulkCreate(invitees)
				.then((invitees) => {
					let eventInvitee = invitees.map((i) => {
						return {
							eventId : event.id,
							inviteeId : i.id
						}
					});

					EventInvitee
						.bulkCreate(eventInvitee)
						.then((eiArr) => {
							res
								.status(200)
								.send(event)
						})
				})
		}
		else {
			res
			   .status(200)
			   .send(event)
		}
	})
	.catch((err) => {
		res
		.status(500)
		.send("There was an error creating event")
	})
});

// GET :id
route.get('/:id', (req, res) => {
	// Event.findByPrimary(req.params.id)
    Event
        .findOne({
        	where : {
        		id : req.params.id
        	},
        	include : [{
        		models : User,
        		as : 'host',
        		attributes : ['username', 'email']
        	}]
        })
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

// GET :id/invitees
route.get('/:id/invitees', (req, res) => {
    EventInvitee
    	.findAll({
	        where: {
	            eventId: req.params.id,
	            '$event.hostId$': req.user.id,
	        },
	        include: [Invitee, {
	            model: Event,
	            as: 'event',
	            attributes: ['hostId']
	        }]
	    })
	    .then((invitees) => {
	        if (invitees) {
	            res.status(200).send(invitees)
	        } else {
	            res.status(500).send('No invitees found for this event')
	        }
	    })
});

// PUT
route.put('/:id', (req, res) => {
    Event
    	.update({
            title: req.body.title,
            message: req.body.message,
            startTime: req.body.startTime ? new Date(req.body.startTime) : undefined,
            endTime: req.body.endTime ? new Date(req.body.endTime) : undefined,
            imgUrl: req.body.imgUrl,
            venue: req.body.venue,
        },
        {
            where: {
                id: req.params.id,
                hostId: req.user.id
            }
        })
        .then((updatedEvent) => {
            if (updatedEvent[0] == 0) {
                return res
                		.status(403)
                		.send('Event does not exist, or you cannot edit it')
            } 
            else {
                res
                   .status(200)
                   .send('Event successfully edited')
            }

    })
});

// DELETE
route.delete('/:id', /*authUtils.eia(),*/ (req, res) => {
    Event.destroy(
        {
            where: {
                id: req.params.id,
                hostId: /*req.userIsAdmin ?*/ req.user.id //: undefined
            }
        }).then((destroyedRows) => {
        if (destroyedRows == 0) {
            return res.status(403).send('Event does not exist, or you cannot edit it')
        } else {
            res.status(200).send('Event successfully deleted')
        }
	})
});


module.exports = route;