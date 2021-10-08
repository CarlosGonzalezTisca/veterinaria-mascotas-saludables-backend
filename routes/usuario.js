var express = require('express');
var router = express.Router();

const mongoose=require('mongoose');
const Usuario= mongoose.model('usuario');
const{check,ValidacionesResult, validationResult}=require('express-validator');
const bcrypt = require ('bcrypt') ;  

////////////////////////////////////////////////////////////////////////////////////////
router.get('/', async(req, res, next)=> {
  const usuario= await Usuario.find(function(err,usuario){
 
   if(err){next(err)}
   res.json(usuario)
  })
 
 }); 

//////////////////////////////////////////////////////////////////////////////////
 router.post('/', [
  check ('_id').isLength({min:1}),
  check ('codigo').isLength({min:1}),
  check ('tipo').isLength({min:1}),
  check('nombre').isLength({min:1}),
  check('email').isLength({min:1}),
  check('password').isLength({min:1}),
],async(req, res)=> {
  
const errors= validationResult(req);
if(!errors.isEmpty()){
  return res.status(422).json({errors: errors.array()});
}
let usuario = await Usuario.findOne({email: req.body.email})
if(usuario){
  return res.status(400).send('Usuario ya exite')
}
const salt= await bcrypt.genSalt(10)
const passcifrado= await bcrypt.hash(req.body.password,salt)
//usuario= new Usuarios(req.body);
usuario= new Usuario({
  _id:req.body._id,
  codigo:req.body.codigo,
  tipo:req.body.tipo,
  nombre:req.body.nombre,
  email:req.body.email,
  password:passcifrado,
  
});
await usuario.save()
res.status(200).send(usuario)

 }); 
/////////////////////////////////////////////////////////////////////////////
 router.post('/login',[
  check('email').isLength({min:1}),
  check('password').isLength({min:1})
  ],async(req,res)=>{
  
  
  const errors= validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }
  
  let usuario=await Usuario.findOne({email:req.body.email})
  if(!usuario){
  return res.status(400).send('Usuarios o Contraseña incorrectos')
  
  }
  
  const validaPassword=await bcrypt.compare(req.body.password,usuario.password)
  if(!validaPassword){
    return res.status(400).send('Usuarios o Contraseña incorrectos')
  }
  
  const jwtoken = usuario.generadorJWT();
  const envio=jwtoken+","+usuario.nombre+","+usuario.tipo
  res.status(201).send({envio})
  })
  
  ////////////////////////////////////////////////////////////////////////////
  router.put('/modificarx'/*,auth*/,async(req,res)=>{
    let usuario=await Usuario.findOne({codigo:req.body.codigo})
    if (!usuario) {
     return res.status(400).send("Usuario Encontrado")   
    }
    
    const salt= await bcrypt.genSalt(10)
    const passcifrado= await bcrypt.hash(req.body.password,salt)
    
    let usuario_mod=await Usuarios.findOneAndUpdate({codigo:req.body.codigo},{
    
    nombre:req.body.nombre,
    email:req.body.email,
    password: passcifrado,  
    fecha_reg:req.body.fecha
    
    },
    
    {
    
    new : true
    
    })
    
    res.send(usuario_mod)
    
    })



    router.delete('/borrar/:_id', async (req, res) => {

      await Usuario.findOneAndDelete({ _id: req.params._id }, function (err, Cliente) {
    
          if (err) { res.send(err) }
          res.json({ Mensaje: 'Usuario eliminado' })
    
      })
    
    
    })

    router.get('/buscarcorreo/:email', async (req, res) => {
      let Cli = await Usuario.findOne({ email:req.params.email })
      if (Cli) {
          res.json(Cli)
      }
      res.send("Cliente no encontrado")
  })

  router.get('/id', async (req, res) => {
    id = await Usuario.find({}, { limit: 1 }).sort({ $natural: -1 }).limit(1)
    res.send(id);
})
   
module.exports = router;
