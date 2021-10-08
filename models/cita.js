const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
    "_id": { type: Number, required: true, unique: true  },
    "correo": { type: String, required: true},
    "activa":{type:Boolean},
    "numerocita": { type: String, },
    "fecha": { type: String, },
    "hora": { type: String, },
    "descripcion": { type: String },
    "mascota": [{
        "_idmasc": { type: String },
        "nombremasc": { type: String },
        "raza": { type: String },
        "tamano":{ type: String },
        "peso":{ type: String },
        
    }],

    "servicio": [{
        "nombreserv": { type: String },
        "costo": { type: Number },
        "descuento": { type: Number },
        "total": { type: Number },
    }],
})
mongoose.model('cita', CitaSchema);