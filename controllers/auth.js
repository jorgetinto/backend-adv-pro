const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

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
            token: token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
}


module.exports = {
    login
}