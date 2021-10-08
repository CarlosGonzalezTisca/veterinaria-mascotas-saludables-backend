var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const empleadoSchema = mongoose.model('empleados');


const { check, ValidacionesResult, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');


/* GET users listing. 
router.get('/', async(req, res, next)=> {
 const usuarios= await Usuarios.find()
 if(usuarios){

  res.send(usuarios)
 }
 res.send("no hay usuarios que mostrar")
});
*/
router.get('/id', async (req, res) => {
  id = await empleadoSchema.find({}, { limit: 1 }).sort({ $natural: -1 }).limit(1)
  
  res.send(id);
})


router.get('/', async (req, res, next) => {
  await empleadoSchema.find((err, emple) => {

      if (err) { return next(err) }
      res.json(emple);

  })
});

//TODO:RUTAS ESPECIFICAS.

// BUSCAR POR ID
router.get('/buscar1/:_id', async (req, res) => {

  const emple = await empleadoSchema.findOne({ _id: req.params._id })

  if (emple) {

      return res.json([emple])
  }
  return res.send("Empleado no encontrado ")

});
//BUSCAR POR NOMBRE
router.get('/nombre/:nombre', async (req, res) => {
  let emple = await empleadoSchema.findOne({ nombre: req.params.nombre })
  if (emple) {
      res.json(emple)
  }
  res.send("Empleado no encontrado")
})
//BUSCAR POR TELEFONO
router.get('/tel/:telefono', async (req, res) => {
  let emple = await empleadoSchema.findOne({ telefono: req.params.telefono })
  if (emple) {
      res.json(emple)
  }
  res.send("Empleado no encontrado")
})

//BUSCAR POR CORREO
router.get('/correo/:correo', async (req, res) => {
  let emple = await empleadoSchema.findOne({ correo: req.params.correo })
  if (emple) {
      res.json(emple)
  }
  res.send("Empleado no encontrado")
})
//VER TRABAJADORES DE LA MAÑANA.
router.get('/turnoM', async (req, res) => {
  let emple = await empleadoSchema.find({ horas: "10am-3pm" })
  if (emple) {
      res.json(emple)
  }
  res.send("Error")
})
//VER TRABAJADORES DE LA TARDE.
router.get('/turnoV/', async (req, res) => {
  let emple = await empleadoSchema.find({ horas: "4pm-7pm" })
  if (emple) {
      res.json(emple)
  }
  res.send("Error")
})



// POST
router.post('/', async (req, res) => {
  let emple = await empleadoSchema.findOne({ correo: req.body.correo })

  if (emple) {
    return res.send("Empleado ya existe")
  }

  emple = new empleadoSchema({

    _id: req.body._id,
    nombre: req.body.nombre,
    apellido1: req.body.apellido1,
    apellido2: req.body.apellido2,
    direccion: req.body.direccion,
    telefono: req.body.telefono,
    correo: req.body.correo,
    horas: req.body.horas,
    dias: req.body.dias
     
  })
  await emple.save()
  res.status(201).send(emple)
})

// PUT
router.put('/', async (req, res) => {
  const emple = await empleadoSchema.findOneAndUpdate({ _id: req.body._id },

    {
      "nombre": req.body.nombre,
      "apellido1": req.body.apellido1,
      "apellido2": req.body.apellido2,
      "direccion": req.body.direccion,
      "telefono": req.body.telefono,
      "correo": req.body.correo,
      
        "horas": req.body.horaini,
        "dias": req.body.dias
     
    },
    { new: true })
    res.send(emple)
})

//BORRAR.
router.delete('/borrar/:_id', async (req, res) => {

  await empleadoSchema.findOneAndDelete({ _id: req.params._id }, function (err, Cliente) {

      if (err) { res.send(err) }
      res.json({ Mensaje: 'Empelado eliminado' })

  })


})
module.exports = router;
