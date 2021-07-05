const { response } = require( 'express' )
const Evento = require('../models/Evento')


const getEventos = async ( req, res = response ) => {

    const eventos = await Evento.find()
                                .populate('user', 'name');

    try {
        res.status(201).json({
            ok: true,
            eventos
        });

    } catch (error) {
        res.status(500).json({
            ok: false, 
            msg: 'No se pudo procesar la solicitud'
        })
    }
}

const crearEvento = async ( req, res = response ) => {

    const evento = new Evento( req.body )
    try{
        evento.user = req.uid;
        const eventoDB = await evento.save();

        res.status(201).json({
            ok: true,
            evento: eventoDB
        });

    } catch (error) {
        res.status(500).json({
            ok: false, 
            msg: 'No se pudo procesar la solicitud'
        })
    }
}

const actualizarEvento = async ( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {

        const evento = await Evento.findById( eventoId )
        
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg:'evento no existe por ese id'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg:'no tiene privilegio para editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true} );

        return res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false, 
            msg: 'No se pudo procesar la solicitud'
        })
    }
}

const eliminarEvento = async( req, res = response ) => {
    const eventoId = req.params.id;
    const uid = req.uid

    try {

        const evento = await Evento.findById( eventoId )
        
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg:'evento no existe por ese id'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg:'no tiene privilegio para eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete(eventoId, (err) => {
            if (err){
                console.log(err)
                return res.status(401).json({
                    ok: false,
                    msg:'no se pudo eliminar el evento'
                });
            }
            else{
                return res.status(201).json({
                    ok: true,
                });
            }
        })
   
    } catch (error) {
        res.status(500).json({
            ok: false, 
            msg: 'No se pudo procesar la solicitud'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}