const mongoose = require('mongoose');
mongoose.set('useCreateIndex',true)
const jwt =require('jsonwebtoken');
const UsuarioSchema= new mongoose.Schema({
    _id : {
        type:Number,
        required: true,
        unique: true,
    },
    codigo : {
        type:Number,
        required: true,
        unique: true,
    },
    tipo : {
        type: Number,
        required: true,
    
    },
    fecha_reg:{
        type:Date,
        default:Date.now
    },
    nombre:{
        type :String,
        required:true,

    },
    email:{
        type: String,
        required: true,
        unique:true,

    },
    password:{
        type: String,
        required: true
    }

    
})
UsuarioSchema.methods.generadorJWT=function(){
    return jwt.sign({
          nombre:this.nombre,
          email:this.email
    
        },"c0ntr4s3n14")
    }
    
mongoose.model('usuario',UsuarioSchema);
