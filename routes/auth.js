/*
    Ruta: /api/auth
*/

const { Router } = require('express');
const { login, googleSignIn } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post('/', [
    check('password', 'El password es obligatoro').not().isEmpty(),
    check('email', 'El email es obligatoro').isEmail(),
    validarCampos
], login);

router.post('/google', [
    check('token', 'El token de google es obligatoro').not().isEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;