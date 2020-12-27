const chalk = require('chalk');
const socketIO = require('socket.io');  // Debe ser la version 2.3.0
const Alarma = require('../models/alarma.model');

const mqtt = require('mqtt');
const topic_envio = 'estado_alarma_back';
const topic_recepcion = 'estado_alarma_esp32';
const socketName = 'estado_alarma';
const client = mqtt.connect('mqtt://localhost:1883');

const mqttConnect = (server) => {

    // Conexion con Broker MQTT establecida
    client.on('connect', () => {
        console.log(chalk.blue('[MQTT]') + ' - Conexion con Broker MQTT -> ' + chalk.green('[Correcta]')); 
        // Se suscribe al topico - Estado Alarma
        client.subscribe(topic_recepcion, () => {
            console.log(chalk.blue('[MQTT]') + ` - Suscripción al topico - ${topic_recepcion} -> ` + chalk.green('[Correcta]'));
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
            let mqttPayload;
            io.emit(socketName, estado);            // Se reenvia a los otros clientes - WebSocket
            
            switch (estado) {
                case 'Desactivada':
                    mqttPayload = 'd';
                    break;
                case 'Activada':
                    mqttPayload = 'a';
                    break;
                case 'Sonando':
                    mqttPayload = 's';
                    break;
                default:
                    break;
            }
            client.publish(topic_envio, mqttPayload);       // Se envia el estado por el topico MQTT
        })

    });

    // Se escucha el topico "estado_alarma"
    client.on('message', async ( topicoEntrada , message) => {
        
        let estado;

        switch (String(message)) {
            case 'd':
                estado = 'Desactivada'
                break;
            case 'a':
                estado = 'Activada'
                break;
            case 's':
                estado = 'Sonando'
                break;  
            case 'r':
                let mqttPayload;
                const alarma = await Alarma.find();
                if(alarma[0].estado === 'Desactivada') mqttPayload = 'd';
                else if(alarma[0].estado === 'Activada') mqttPayload = 'a';
                else if(alarma[0].estado === 'Sonando') mqttPayload = 's';
                console.log(mqttPayload);
                client.publish(topic_envio, mqttPayload);
                break;  
            default:
                break;
        }

        if(String(message) !== 'r'){
            
            console.log('Guardando nuevo estado');
            console.log(estado);
            
            // Se envia estado por websocket a todos los clientes
            io.emit(socketName, estado);
            
            // Se almacena estado en la base de datos
            const alarma = await Alarma.find();
            await Alarma.findByIdAndUpdate(alarma[0]._id, { estado }, {new: true});
        }

    });
    
}

module.exports = mqttConnect;