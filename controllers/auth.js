const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const {getMenuFrontEnd} = require('../helpers/menu-frontend');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response)  => {

    const { email, password } = req.body;

    try {

        // verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'contraseña no valida'
            });
        }

        // generar Token
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token: token,
            menu: getMenuFrontEnd(usuarioDB.role)
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
}

const googleSignIn = async(req, res = response)  => {

    const googleToken = req.body.token;

    try {

       const {name, email, picture} = await googleVerify(googleToken);

       const usuarioDB = await Usuario.findOne({email});
       let usuario;

       if (!usuarioDB) {
           // si no existe el usuario
           usuario = new Usuario({
               nombre: name,
               email,
               password: '@@@@',
               img: picture,
               google: true
           });
       } else {
          // existe usuario
          usuario = usuarioDB,
          usuario.google = true; 
       }

       // Guardar en BD
       usuario.save();

        // generar Token
        const token = await generarJWT(usuario.id);
        
        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuario.role)
        })

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
}

const renewToken = async(req, res = response)  => {    

    try {

        const uid = req.uid;

        // generar Token
        const token = await generarJWT(uid);

        //obtener usuario por UID
        const usuario = await Usuario.findById(uid);

        res.json({
            ok: true,
            token,
            usuario,
            menu: getMenuFrontEnd(usuario.role)
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}