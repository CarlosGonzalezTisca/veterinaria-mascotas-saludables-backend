const mongoose = require('mongoose');
const MascotaSchema= new mongoose.Schema({

   
        "_id": { type: Number, required: true, unique: true },

        "nombre_masc": { type: String },

        "raza": { type: String },

        "estatura": { type: String },

        "peso": { type: String },

      "tamano":{ type: String },
        
      "dueno":{type: String},

      "correo":{type: String},


  
})
mongoose.model('Mascotas', MascotaSchema);