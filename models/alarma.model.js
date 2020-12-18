const {Schema, model} = require('mongoose');

const semaforoModel = Schema({
    estado: {
        type: String,
        required: true,
    },
    ultima_activacion: {
        type: Date,
        default: Date.now,
    },
    ultima_desactivacion: {
        type: Date,
        default: Date.now,
    },
    ultima_sonando: {
        type: Date,
        default: Date.now,
    }
});

module.exports = model('alarma', semaforoModel);