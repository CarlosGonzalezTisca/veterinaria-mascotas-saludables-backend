var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const CitaSchema = mongoose.model('cita');

//LISTAR CITAS
router.get('/', async (req, res, next) => {
    await CitaSchema.find((err, cita) => {

        if (err) { return next(err) }
        res.json(cita);

    })
});
//TODO:AGREGAR.
router.post('/', async (req, res) => {
    
    let cita = await CitaSchema.findOne({ _id: req.body._id })
    if (cita) {
        return res.send("Cita ya existe")
    }
    let fecha = await CitaSchema.findOne({ fecha: req.body.fecha})
    let identi = await CitaSchema.findOne({ hora: req.body.hora})
    if(fecha && identi){
        
        return res.send("Cita no disponible")
    }
    else{
    cita = new CitaSchema({
        
        _id:req.body._id,
        correo:req.body.correo,
        activa:req.body.activa,
        numerocita: req.body.numerocita,
        fecha: req.body.fecha,
        hora: req.body.hora,
        descripcion: req.body.descripcion,
        
        mascota: [{
            _idmasc: req.body._idmasc,
            nombremasc: req.body.nombremasc,
            raza: req.body.raza,
            tamano: req.body.tamano,
            peso: req.body.peso,
        }],
        servicio: [{
            nombreserv: req.body.nombreserv,
            costo: req.body.costo,
            descuento: req.body.descuento,
            total: req.body.total,
        }]
    });
}//else fecha y hora
 await cita.save(function(err){
        if(err){

            return res.send("Hola , Adios");
        }else{
            return res.status(201).send(cita);
        }
    });
   
   

})
//
router.put('/', async (req, res) => {
    const CitaUpdate = await CitaSchema.findOneAndUpdate({ correo: req.body.correo },
        {

            "numerocita": req.body.numerocita,
            "fecha": req.body.fecha,
            "hora": req.body.hora,
            "identhora": req.body.identhora,
            "descripcion": req.body.descripcion,
            "mascota": [{
                "_idmasc": req.body._idmasc,
                "nombremasc": req.body.nombremasc
            }],
            "servicio": [{
                "nombreserv": req.body.nombreserv,
                "costo": req.body.costo,
                "descuento": req.body.descuento,
                "total": req.body.total,
            }]
        },

        { new: true })
    res.send(CitaUpdate)
});

//INACTIVARCITA

router.put('/inactivarcita', async (req, res) => {
    const CitaUpdate = await CitaSchema.findOneAndUpdate({ correo: req.body.correo },
        {
            "activa":req.body.activa
        },

        { new: true })
    res.send(CitaUpdate)
});

router.delete('/:_id', async (req, res) => {

    await CitaSchema.findOneAndDelete({ _id: req.params._id }, function (err, Cita) {

        if (err) { res.send(err) }
        res.json({ Mensaje: 'Cita eliminado' })

    })


})


router.get('/ultimo/id', async (req, res) => {
    id = await CitaSchema.find({}, { limit: 1 }).sort({ $natural: -1 }).limit(1)
    res.json(id);
})
   
module.exports = router;