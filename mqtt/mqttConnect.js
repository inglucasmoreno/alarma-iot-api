const chalk = require('chalk');
const mqtt = require('mqtt');
const socketIO = require('socket.io');  // Debe ser la version 2.3.0
const topic = 'estado_alarma';
const Alarma = require('../models/usuario.model');

const mqttConnect = (server) => {
    const io = socketIO(server);
    io.on('connect', socket => {
        console.log('Usuario conectado...');
        socket.on('disconnect', () => {
            console.log('Usuario deconectado...')
        });     
        socket.on('estado_alarma', estado => {
            io.emit('estado_alarma', estado);   // Se reenvia a los otros clientes
            // Enviar por mqtt --->
        })
    });

    
}

module.exports = mqttConnect;