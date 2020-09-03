/*
    Ruta: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario , borrarUsuario} = require('../controllers/usuarios');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../helpers/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/', 
    [
        check('nombre', 'El nombre es obligatoro').not().isEmpty(),
        check('password', 'El password es obligatoro').not().isEmpty(),
        check('email', 'El email es obligatoro').isEmail(),
        validarCampos,
    ],
crearUsuario);

router.put('/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatoro').not().isEmpty(),
        check('email', 'El email es obligatoro').isEmail(),
        check('nombre', 'El role es obligatorio').not().isEmpty(),
        validarCampos,
    ],
actualizarUsuario);

router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;