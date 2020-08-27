/*
    Ruta: /api/auth
*/

const { Router } = require('express');
const { login } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post('/', [
    check('password', 'El password es obligatoro').not().isEmpty(),
    check('email', 'El email es obligatoro').isEmail(),
    validarCampos
], login);

module.exports = router;