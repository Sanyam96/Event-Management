const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('./auth/passport');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser('my secret'));
app.use(expressSession({
	secret : 'my secret', /* secret a string or array used for signing cookies. This is optional and if not specified, will not parse signed cookies. If a string is provided, this is used as the secret. If an array is provided, an attempt will be made to unsign the cookie with each secret in order. */
	resave : false,
	saveUninitialized : false
}));


app.use(passport.initialize());
app.use(passport.session());


app.use('/api', require('./routes/api'));
app.use('/', require('./routes/index'));
app.use('/', express.static(__dirname + "/public_static"));

// app.get('/', (req, res) => {
// 	res.send('hello World');
// });

app.listen(2345, function () {
	console.log("server started at port 2345!!!!");
});