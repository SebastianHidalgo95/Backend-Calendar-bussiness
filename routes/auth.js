/* 
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } =  require('express-validator');
const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt')
const router = Router();

router.post(
    '/', 
    [   //middleware
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 o mas caracteres').isLength({ min: 6}),
        validarCampos
    ],
    loginUsuario );

router.post(
    '/register', 
    [   //middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 o mas caracteres').isLength({ min: 6}),
        validarCampos
    ] , 
    crearUsuario);

router.get(
    '/renew',
    validarJWT,
    revalidarToken );

module.exports = router;