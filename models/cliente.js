const mongoose = require('mongoose');
const ClienteSchema = new mongoose.Schema({

    "_id": { type: Number, required: true, unique: true },

    "nombre": { type: String },

    "apellido1": { type: String },

    "apellido2": { type: String },

    "direccion": { type: String },

    "telefono": { type: String },

    "correo": { type: String, unique: true },

    "jaula": [{
        "numerojaula": { type: String },
        "activa": { type: String },
        "idmascota": { type: String },
        "hora_jau": { type: String }
        
    }],
   

    "tipocliente": [{
        "registrado": { type: String }
    }]
})

mongoose.model('cliente', ClienteSchema);
