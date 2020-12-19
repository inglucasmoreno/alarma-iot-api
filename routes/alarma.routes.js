const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { 
    getAlarma,
    inicializarAlarma,
    actualizarAlarma,
    eliminarAlarma
} = require('../controllers/alarma.controllers');

const router = new Router();

router.get('/', validarJWT ,getAlarma);
router.post('/', validarJWT ,inicializarAlarma);
router.put('/', 
            [   
                validarJWT,
                check('estado', 'El estado de la alarma es obligatorio').not().isEmpty(), 
                validarCampos
            ], 
            actualizarAlarma
);
router.delete('/', validarJWT ,eliminarAlarma);

module.exports = router;