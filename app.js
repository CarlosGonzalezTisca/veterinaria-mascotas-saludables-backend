var  createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const mongoose = require('mongoose');

let user= "carlos";
let password="cegt171298"
let uri ="mongodb+srv://"+user+":"+password+"@cluster0.l9v4i.mongodb.net/veterinaria?retryWrites=true&w=majority"
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}) 
.then(()=>console.log('BD CONECTADA'))
.catch(e => console.log(e))
require('./models/usuario');
require('./models/cliente');
require('./models/empleado');
require('./models/cita');
require('./models/mascota');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usuario');
var clienteRouter = require('./routes/cliente');
var empleadoRouter = require('./routes/empleado');
var citaRouter = require('./routes/cita');
var mascotaRouter = require('./routes/mascota');

const cors=require('cors');
var app = express();
app.use(cors({"origin": '*',
"methods": "GET,HEAD,PUT,PATCH,POST,DELETE, PUSH",
"preflightContinue": false,
"optionsSuccessStatus": 204})); 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
// La sig linea arregla el routing en angular una vez lanzado en produccion:


app.use('/usuario', usersRouter);
app.use('/cliente', clienteRouter);
app.use('/empleado', empleadoRouter);
app.use('/cita', citaRouter);
app.use('/mascota', mascotaRouter);
app.use('/*', (req, res)=>{
  res.sendFile(path.join(path.join(__dirname + '/public/index.html')));
});
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
