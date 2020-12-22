const chalk = require('chalk');
const socketIO = require('socket.io');  // Debe ser la version 2.3.0
const Alarma = require('../models/alarma.model');

const mqtt = require('mqtt');
const topic = 'estado_alarma';
const socketName = 'estado_alarma';
const client = mqtt.connect('mqtt://localhost:1883');

const mqttConnect = (server) => {

    // Conexion con Broker MQTT establecida
    client.on('connect', () => {
        console.log(chalk.blue('[MQTT]') + ' - Conexion con Broker MQTT -> ' + chalk.green('[Correcta]')); 
        // Se suscribe al topico - Estado Alarma
        client.subscribe(topic, () => {
            console.log(chalk.blue('[MQTT]') + ` - Suscripción al topico - ${topic} -> ` + chalk.green('[Correcta]'));
        })
    })

    // Conexion a WebSocket
    const io = socketIO(server);

    // Conexion a websocket establecida
    io.on('connect', socket => {
        
        // Mensajes de conexion/desconexion de usuarios
        console.log(chalk.yellow('[MQTT]') + ' - Usuario conectado...');
        socket.on('disconnect', () => {
            console.log(chalk.yellow('[MQTT]') + ' - Usuario deconectado...')
        });
        
        // Se escucha el socket "estado_alarma"
        socket.on(socketName, estado => {
            io.emit(socketName, estado);            // Se reenvia a los otros clientes - WebSocket
            client.publish(topic, estado);          // Se envia el estado por el topico MQTT
        })

    });

    // Se escucha el topico "estado_alarma"
    client.on('message', async ( topicoEntrada , message) => {
        
        // Se conviente a String el mensaje recibido
        const estado = String(message);
        
        // Se envia estado por websocket a todos los clientes
        io.emit(socketName, estado);

        // Se almacena estado en la base de datos
        const alarma = await Alarma.find();
        await Alarma.findByIdAndUpdate(alarma[0]._id, { estado }, {new: true});
    });
    
}

module.exports = mqttConnect;