const Sequelize = require('sequelize');

const db = new Sequelize({
	username : 'eventman',
	password : 'eventadmin',
	database : 'eventpass',
	host : 'localhost',
	dialect : 'mysql',
	pool : {
		max : 5,
		min : 0,
		idle : 10000
	}

});

//	Tables of DB
const Event = db.define('event', {
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true,
		autoIncrement : true
	},
	title : Sequelize.STRING,
	venue : Sequelize.STRING,
	imgUrl: Sequelize.STRING,
    startTime: Sequelize.DATE,
    endTime: Sequelize.DATE,
    message: Sequelize.STRING
});

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING
});

const Invitee = db.define('invitee', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        index: true
    }
});

const EventInvitee = db.define('eventinvitee', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});
// ------------


// relationships of tables
Event.belongsTo(User, {				// A single Event belongs to a User as host(one to one)
    foreignKey: 'hostId',
    as: 'host'
});

User.hasMany(Event, {				// one user can host multiple events(one to many)
    foreignKey: 'hostId'
});

EventInvitee.belongsTo(Event);		// A single EventInvitee belongs to a Single Event 
Event.hasMany(EventInvitee);		// A single Event has multiple EventInvitee
EventInvitee.belongsTo(Invitee);	// An EventInvitee belongs to a Invitee
Invitee.hasMany(EventInvitee);		// A single Invitee has many EventInvitee
// id of one event -> many invitee
// id of one invitee -> many events!
// ---------------


db.sync({force: false}).then(() => {
    console.log('Database is synchronised');
});

module.exports = {
    Event, 
    User, 
    Invitee, 
    EventInvitee
};
