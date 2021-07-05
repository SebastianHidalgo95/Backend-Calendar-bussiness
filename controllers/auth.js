const { response } = require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async ( req, res = response ) => { 
    
    const { email, password } =  req.body;
    
    try {
        
        let usuario = await Usuario.findOne( { email } );
        

        if( usuario ) {
            return res.status(400).json({
                ok:false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);


        await usuario.save();

        //GENERA JWT
        const token = await generarJWT( usuario.id, usuario.name );
        
        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token

        });

    } catch (error) {

        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el admin'
        })
    }

    
}

const loginUsuario = async( req, res = express.response ) => { 
    
    const { email, password } =  req.body;

    try {

        const usuario = await Usuario.findOne( { email } );

        if( !usuario ) {
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no existe con ese email'
            });
        }

        //confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if( !validPassword ) {
            return res.status(400).json({
                ok:false,
                msg: 'Contraseña incorrecta'
            });
        }

        //GENERA JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el admin'
        })
    }
}

const revalidarToken = async( req, res = express.response ) => { 
    
    const { uid, name } = req;

    
    // Generar un nuevo JWT y retornalo en esta petición
    const token = await generarJWT( uid, name );

    res.json({
        ok:true,
        token
    })
}

module.exports = {
    crearUsuario, 
    revalidarToken, 
    loginUsuario
}