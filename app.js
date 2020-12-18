var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var resolutionRouter = require('./routes/resolution');
var userModel 			= require('./models/usersModel');

var env = require('./env');
var globalVariables = require('./global_variables')[env.instance];
console.log('Environment :: ' + env.instance);
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
//pp.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var appScreensRouter = require('./routes/app_screens')(app, express);

app.use('/', indexRouter);
app.use('/v1/resolution/', resolutionRouter);
app.use('/v1/app_screens/', appScreensRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});
setInterval(function(){ 
	userModel.wakeCallMysql();
}, 20000);
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
