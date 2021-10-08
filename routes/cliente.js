var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const ClienteSch = mongoose.model('cliente');


//TODO:ID: Obtiene el ultimo ID registrado

router.get('/id', async (req, res) => {
    id = await ClienteSch.find({}, { limit: 1 }).sort({ $natural: -1 }).limit(1)
    res.send(id);
})
//BUSCAR POR ID

router.get('/uno/:_id', async (req, res) => {
    let Cli = await ClienteSch.findById({ _id: req.params._id })
    if (Cli) {
        res.json([Cli])
    }
    res.send("Cliente no encontrado")
})

//BUSCAR POR NOMBRE
router.get('/nombre/:nombre', async (req, res) => {
    let Cli = await ClienteSch.findOne({ nombre: req.params.nombre })
    if (Cli) {
        res.send(Cli)
    }
    res.send("Cliente no encontrado")
})
//BUSCAR POR NOMBRE Y PRIMER APELLIDO
router.get('/buscarna', async (req, res) => {
    const nombreape = await ClienteSch.findOne({ $and: [{ "nombre": req.body.nombre, "apellido1": req.body.nombre }] })
    if (nombreape) {
        res.send(nombreape)
    }
    return res.send("no se encontro cliente")
})

//BUSCAR CLIENTES QUE TENGA REGISTRADAS MASCOTAS
router.get('/climasc', async (req, res) => {
    const climasc = await ClienteSch.find({ "mascota.nombre_masc": { $exists: true } })
    if (climasc) {
        res.json([climasc])
    }
    return res.send("Err: ningun cliente tiene mascotas")
})
//buscar por correo
router.get('/buscarcorreo/:correo', async (req, res) => {
    let Cli = await ClienteSch.findOne({ correo: req.params.correo })
    if (Cli) {
        res.json(Cli)
    }
    res.send("Cliente no encontrado")
})


//LISTAR CLI
router.get('/', async (req, res, next) => {
    await ClienteSch.find((err, cli) => {

        if (err) { return next(err) }
        res.json(cli);

    })
});

router.post('/', async (req, res) => {
    let Cliente = await ClienteSch.findOne({ correo: req.body.correo })


    if (Cliente) {
        return res.send("Cliente ya existente")
    }
    Cliente = new ClienteSch({

        _id: req.body._id,
        nombre: req.body.nombre,
        apellido1: req.body.apellido1,
        apellido2: req.body.apellido2,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        correo: req.body.correo,//usuario registrado y no registrado

    });

    await Cliente.save();

    res.status(201).send(Cliente);

})





router.put('/', async (req, res) => {
    const Clienteupdate = await ClienteSch.findOneAndUpdate({ _id: req.body._id },
        {
            _id: req.body._id,
            nombre: req.body.nombre,
            apellido1: req.body.apellido1,
            apellido2: req.body.apellido2,
            direccion: req.body.direccion,
            telefono: req.body.telefono,
            correo: req.body.correo,//usuario registrado y no registrado
            mascota: [{

                nombre_masc: req.body.nombre_masc,
                raza: req.body.raza,
                estatura: req.body.estatura,
                peso: req.body.peso,
                jaula: {
                    numerojaula: req.body.numerojaula,
                    activa: req.body.activa,
                    idmascota: req.body.idmascota,
                    hora_jau: req.body.hora_jau
                }
            }
            ],
            cita: [{

                numerocita: req.body.numerocita,
                fecha: req.body.fecha,
                hora: req.body.hora,
                descripcion: req.body.descripcion,
                servicio: [{
                    nombreserv: req.body.nombreserv,
                    costo: req.body.costo,
                    descuento: req.body.descuento,
                    total: req.body.total,
                }]
            }],

            tipocliente: [{
                registrado: req.body.registrado
            }]
        },

        { new: true })
    res.send(Clienteupdate)
});



router.delete('/:_id', async (req, res) => {

    await ClienteSch.findOneAndDelete({ _id: req.params._id }, function (err, Cliente) {

        if (err) { res.send(err) }
        res.json({ Mensaje: 'Cliente eliminado' })

    })


})

//TODO:RUTAS PARA JAULAS

router.get('/getjaulas', async (req, res) => {
    let jau = await ClienteSch.find({}, { jaula: 1 })
    if (jau) { res.json(jau) }
    res.send("ninguna Jaula");
})

router.get('/jauladip/:_id', async (req, res) => {
    let jau = await ClienteSch.findOne({ "jaula.numerojaula": req.params._id }, { "jaula": 1 })
    if (jau) {
        res.send([jau])
    } res.send("disponible")

})
//MODIFICAR Y ELIMINAR JAULA

router.put('/jaula/:_id', async (req, res) => {

    /* function (error, success) {
           if (error) {
               console.log(error);
           } else {
               console.log(success);
               
           } }*/
    let cli = await ClienteSch.findOne({ _id: req.params._id })
    if (cli) {
        let jaula = {
            numerojaula: req.body.numerojaula,
            activa: req.body.activa,
            idmascota: req.body.idmascota,
            hora_jau: req.body.hora_jau

        }

        let jau = await ClienteSch.findOneAndUpdate({ _id: req.params._id },
            { $push: { jaula: jaula } }
            , { new: true })
        res.send(jau)
    }
    else {

        res.send("No se pudo insertar jaula")

    }

    res.send(jau)
})
//ELIMINAR JAULA.
router.put('/eliminarjaula/:numerojaula', async (req, res) => {
    let clien = await ClienteSch.findOne({ "jaula.numerojaula": req.params.numerojaula })
    if (clien) {
        let jaula = {

            numerojaula: req.params.numerojaula,
        }

        const jau = await ClienteSch.findOneAndUpdate({ "jaula.numerojaula": req.params.numerojaula },
            { $pull: { jaula: jaula } },
            { new: true })
        res.send(jau)
    }

    else {

        res.send("No se pudo eliminar Jaula")

    }

    res.send(jau)
})

// RUTAS PARA MASCOTA.
//AGREGAR Y MODIFICAR.
router.put('/mascota', async (req, res) => {
    let clien = await ClienteSch.findOne({ _id: req.body._id })
    if (clien) {
        let Mascota = {

            _idmasc: req.body._idmasc,
            nombre_masc: req.body.nombre_masc,
            raza: req.body.raza,
            estatura: req.body.estatura,
            peso: req.body.peso,

        }

        const masc = await ClienteSch.findOneAndUpdate({ _id: req.body._id },
            { $push: { mascota: Mascota } },
            { new: true })
        res.send(masc)
    }

    else {

        res.send("No se pudo insertar mascota")

    }

    res.send(masc)
})

//ELIMINAR MASCOTA.
router.put('/eliminarmascota', async (req, res) => {
    let clien = await ClienteSch.findOne({ _id: req.body._id })
    if (clien) {
        let Mascota = {

            _idmasc: req.body._idmasc,
        }

        const masc = await ClienteSch.findOneAndUpdate({ _id: req.body._id },
            { $pull: { mascota: Mascota } },
            { new: true })
        res.send(masc)
    }

    else {

        res.send("No se pudo eliminar mascota")

    }

    res.send(masc)
})
//LISTAR MASCOTAS
router.get('/listmasc/:_id', async (req, res) => {
    let masc = await ClienteSch.findById({ "_id": req.params._id }, { "mascota": 1 })
    if (masc) {
        res.json([masc])
    }
    res.send({ "mensaje": "No tiene ninguna mascota registrada" })
})
//TODO:Hacer rutas para citas (CRUD).

//AGREGAR CITA.

router.put('/agregarcita', async (req, res) => {

    let cli = await ClienteSch.findOne({ _id: req.body._id })
    if (cli) {
        let cita = {

            numerocita: req.body.numerocita,
            fecha: req.body.fecha,
            hora: req.body.hora,
            descripcion: req.body.descripcion,
            "servicio": [{
                "nombreserv": req.body.nombreserv,
                "costo": req.body.costo,
                "descuento": req.body.descuento,
                "total": req.body.total,
            }]


        }

        const cita1 = await ClienteSch.findOneAndUpdate({ _id: req.body._id },
            { $push: { cita: cita } },
            { new: true })
        res.send(cita1)


    }//if de cli
    else {

        res.send("No se pudo insertar cita")

    }

    res.send(cita1)


});

//TODO:RUTAS ESPECIFICAS.

//obtiene las mascotas de un cliente por id.
router.get('/getmascotas', async (req, res) => {

    masc = await ClienteSch.find({ "_id": req.body._id }, { "mascota": "nombre_masc" })
    if (masc) {
        res.send(masc)
    }

    else {

        res.send("No tienes mascotas registradas")
    }

})
//TOTAL DE CLIENTES
router.get('/totalcli', async (req, res) => {


    const total = await ClienteSch.find().count();
    return res.json([{ "total": total }]);
})


router.get('/obtenerid/:correo', async (req, res) => {

    let cli = await ClienteSch.find({ "correo": req.params.correo }, { "_id": 1 })
    if (cli) {
        res.json(cli)
    }
    res.send("ID no encontrado")
})

router.get('/buscarID/:_id', async (req, res) => {
    let cli = await ClienteSch.findById({ "_id": req.params._id })
    if (cli) {
        res.json(cli)
    }
    res.send("Cliente no encontrado")

})

module.exports = router;
