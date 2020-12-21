const chalk = require('chalk');
const { success, error } = require('../helpers/response');
const Alarma = require('../models/alarma.model');

// Obtener datos de alarma
const getAlarma = async (req, res) => {
    try{
        const alarmas = await Alarma.find();
        if(alarmas.length === 0) return error(res, 404, 'La alarma no existe');
        success(res, {alarma: alarmas[0]});
    }catch(err){
        console.log(err);
        error(res, 500);
    }
}

// Inicializar nueva alarma
const inicializarAlarma = async (req, res) => {
    try{
        const alarmas = await Alarma.find();       
        if(alarmas.length != 0) return error(res, 400, 'Ya hay una alarma inicializada');

        const alarma = new Alarma({ estado: 'Desactivada' }); 
        await alarma.save();
        success(res, {alarma});

    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Actualizar alarma
const actualizarAlarma = async (req, res) => {
    try{   
        const { estado } = req.body;
        const alarmaBD =  await Alarma.find();
        if(!alarmaBD[0]) return error(res, 404, 'La alarma no existe'); 
        
        switch (estado) {
            case 'Desactivada':
                req.body.ultima_desactivacion = Date.now();
                break;
            case 'Activada':
                req.body.ultima_activacion = Date.now();
                break;
            case 'Sonando':
                req.body.ultima_sonando = Date.now();
                break;
            default:
                break;
        }

        if(estado != 'Desactivada' && estado != 'Activada' && estado != 'Sonando') 
            return error(res, 400, 'Estado de alarma incorrecto');

        const alarma = await Alarma.findByIdAndUpdate(alarmaBD[0]._id, req.body, {new: true});
        success(res, { alarma });
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

// Eliminar alarma
const eliminarAlarma = async (req, res) => {
    try{
        let alarma = await Alarma.find();
        if(alarma.length === 0) return error(404, 'La alarma no existe');
        alarma = await Alarma.findByIdAndDelete(alarma[0]._id);
        success(res, {alarma});
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    } 
}

module.exports = {
    getAlarma,
    inicializarAlarma,
    actualizarAlarma,
    eliminarAlarma
}