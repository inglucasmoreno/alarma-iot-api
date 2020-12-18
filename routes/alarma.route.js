const { Router } = require('express');
const { validarCampos } = require('../middleware/validar-campos');
const { check } = require('express-validator');
const { 
    getAlarma,
    inicializarAlarma,
    actualizarAlarma,
    eliminarAlarma
} = require('../controllers/alarma.controller');

const router = new Router();

router.get('/', getAlarma);
router.post('/', inicializarAlarma);
router.put('/', check('estado', 'El estado de la alarma es obligatorio').not().isEmpty(), 
                validarCampos, 
                actualizarAlarma
);
router.delete('/', eliminarAlarma);

module.exports = router;