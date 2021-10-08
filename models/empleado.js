const mongoose = require('mongoose');
const empleadoSchema = new mongoose.Schema({

    "_id": {type: Number, required: true, unique: true/* required: true,unique: true*/},

    "nombre": {type: String, /*   required: true,*/},

    "apellido1": {type: String,/*   required: true*/},

    "apellido2": {type: String},

    "direccion": {type: String,/* required: true*/},

    "telefono": {type: Number,/* required: true*/},

    "correo":{type:String},

    "horas":{type:String},

    "dias":{type:String},





})

mongoose.model('empleados', empleadoSchema);
