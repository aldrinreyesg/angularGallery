var express = require('express');
var path = require('path');


var config = require('config');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');

var app = express();

//Database
var dbCon = config.get('Gallery.dbConfig');
//var dbString = "mongodb" + '://' + dbCon.get('host') + ':' + dbCon.get('port') + '/' + dbCon.get('dbName');
var dbString = "mongodb://angall:WrwNtjEp1RWHENlI@quirisoft-shard-00-00-hiyhh.mongodb.net:27017,quirisoft-shard-00-01-hiyhh.mongodb.net:27017,quirisoft-shard-00-02-hiyhh.mongodb.net:27017/gallery?ssl=true&replicaSet=quirisoft-shard-0&authSource=admin&retryWrites=true"
mongoose.connect(dbString, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Connected to mongodb");
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

app.use(express.static(__dirname + '/public'));

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

app.listen(3000, 'localhost');
console.log("Angular Gallery Server is Listening on port 3000");