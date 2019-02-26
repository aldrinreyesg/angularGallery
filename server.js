var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require("mongoose");
var fs = require('fs');
var flash = require('express-flash');
var errorHandler = require('express-error-handler');
const cors = require('cors');
const favicon = require('express-favicon');

var dbConn = require('./src/utils/dbConn');

//logger
var morgan = require('morgan');
var winston = require('./app/config/winston');

//Database
mongoose.Promise = global.Promise;


var app = express();
var server;



//all environments Config
app.use(cors());
app.set('port', process.env.PORT || 3000);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser('secret'));
app.use(flash());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true }
}));


// development only
if ('development' == app.get('env')) {
    app.use(errorHandler({server: server}));
}
//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';
if(!isProduction) {
    app.use(errorHandler());
}

//Config Mongoose
var dbString = dbConn(app.get('env'));
mongoose.connect(dbString, {
    useCreateIndex: true,
    useNewUrlParser: true
});
mongoose.set('debug', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Connected to mongodb");
	winston.info("Connected to mongodb");
});

//Error handlers & middlewares
// if(!isProduction) {
//     app.use((err, req, res) => {
//         res.status(err.status || 500);
//
//         res.json({
//             errors: {
//                 message: err.message,
//                 error: err,
//             },
//         });
//     });
// }
// app.use((err, req, res) => {
//     res.status(err.status || 500);
//     res.json({
//         errors: {
//             message: err.message,
//             error: {},
//         },
//     });
// });



//app.use(expressValidator());



//load all files in models dir
// var User = require('../model/schema/User');
require('./src/model/schema/User');
require('./app/config/passport');
// fs.readdirSync(__dirname + '/model/schema/').forEach(function(filename) {
//     if (~filename.indexOf('.js')) require(__dirname + '/model/schema/' + filename)
// });


app.engine('ejs', require('express-ejs-extend'));
app.set('views',path.join(__dirname,'/src/views'));
app.set('view engine','ejs');


//routes
app.use(require('./src/routes'));

// var pages = require('./routes/pages_old.js')(app);
// var services = require('./routes/api/services_old.js')(app, db);
// var adminPages = require('./routes/api/admin.js')(app);

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