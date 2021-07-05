/* 
    Rutas de Eventos / Events
    host + /api/events
*/

const { validarJWT } = require("../middlewares/validar-jwt")
const { Router } = require('express');
const { check } =  require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const router = Router();

//Todas tienen que pasar por la validacion JWT
router.use( validarJWT )

// Obtener eventos 
router.get( '/', getEventos )

// Crear evento
router.post( 
    '/',
    [ // MiddleWares Para validaciones
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio obligatoria').custom( isDate ),
        check('end', 'Fecha de fin obligatoria').custom( isDate ),
        validarCampos
    ],  
    crearEvento )

// Actualizar evento
router.put( 
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalización es obligatoria').custom(isDate),
        validarCampos
    ],
    actualizarEvento )

// borrar evento
router.delete('/:id', eliminarEvento )

module.exports = router;