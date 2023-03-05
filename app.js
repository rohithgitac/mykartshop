var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config()

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();
var hbs = require('express-handlebars');
var fileupload = require('express-fileupload');
var db = require('./configuration/connection');
var session=require('express-session');

const MongoStore = require('connect-mongo'); //for storing session in mongodb



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());
//app.use(session({secret:'key',cookie:{maxAge:60000000}}));
app.use(session({
  secret: 'foo',
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://rohithabcontact:HpOreQm0HYnAPBIk@cluster0.droghcc.mongodb.net/ecommerse',
    ttl: 14 * 24 * 60 * 60
  })
}));
db.connect((err)=>
{
  if(err)
  {console.log("connection error"+err);}
  else
  {console.log("Database connected to Atlas");}
});

app.use('/', userRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
