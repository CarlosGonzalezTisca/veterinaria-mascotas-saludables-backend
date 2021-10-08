var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Mascota = mongoose.model('Mascotas');
//consultar TODO
router.get('/', async (req, res, next) => {
    await Mascota.find((err, cli) => {

        if (err) { return next(err) }
        res.json(cli);

    })
});


//OBTENER ULTIMO ID
router.get('/id', async (req, res) => {
    id = await Mascota.find({}, { limit: 1 }).sort({ $natural: -1 }).limit(1)
    res.send(id);
})

//AGREGAR MASCOTA
router.post('/insertar', async (req, res) => {
    let Correo = await Mascota.findOne({ correo: req.body.correo })
    let idd = await Mascota.findOne({ _id: req.body._id })
    let Dueno = await Mascota.findOne({ dueno: req.body.dueno })  


    if (Correo && idd) {
        return res.send("Mascota ya existente")
    }
    mascota = new Mascota({

        _id: req.body._id,

        nombre_masc: req.body.nombre_masc,

        raza: req.body.raza,

        estatura: req.body.tamano,

        peso: req.body.peso,

        dueno: req.body.dueno,

        correo: req.body.correo

    });

    await mascota.save();

    res.status(201).send(mascota);

})





router.delete('/borrar/:_id', async (req, res) => {

    await Mascota.findOneAndDelete({ _id: req.params._id }, function (err, Cliente) {

        if (err) { res.send(err) }
        res.json({ Mensaje: 'Mascota Eliminada' })

    })


})

//listar mascotas
router.get('/buscarmasc/:correo', async (req, res)=>
{
   masc = await Mascota.findOne({"correo":req.params.correo})
   if(masc){
       res.send(masc)
   }
   res.send("Mascotas no encontradas")
})



module.exports = router;
