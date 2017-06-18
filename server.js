const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser({
	secret : 'my secret',
	resave : false,
	saveUninitialized : false
}));

app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
	res.send('hello World');
});

app.listen(2345, function () {
	console.log("server started at port 2345!!!!");
});