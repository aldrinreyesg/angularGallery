var express = require('express');

var path = require('path');


var mongoose = require("mongoose");
var fs = require('fs');
var bodyParser = require('body-parser');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
const favicon = require('express-favicon');
var errorHandler = require('express-error-handler');
var dbConn = require('./utils/dbConn');

//logger
var morgan = require('morgan');
var winston = require('./config/winston');

var app = express();
var server;

//all environments
app.set('port', process.env.PORT || 3000);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));


// development only
if ('development' == app.get('env')) {
    app.use(errorHandler({server: server}));

	var dbString = dbConn(app.get('env'));
    mongoose.connect(dbString, { useNewUrlParser: true });
}


//load all files in models dir
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
    if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});


//Database
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Connected to mongodb");
	winston.info("Connected to mongodb");
});


app.use(cookieParser('secret'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(expressValidator());



app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: false,
	cookie: { secure: true }
	}));
app.use(flash());



app.engine('ejs', require('express-ejs-extend'));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//routes
var pages = require('./routes/pages.js')(app);
var services = require('./routes/services.js')(app, db);
var adminPages = require('./routes/admin.js')(app);

// index
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// app.listen(app.get('port'), 'localhost');
// console.log("Angular Gallery Server is Listening on port 3000");


server = app.listen(app.get('port'), function(){
    console.log('server is running at %s .', server.address().port);
});