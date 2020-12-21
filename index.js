const chalk = require('chalk');
require('dotenv').config();

// [Express]
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const server_port = process.env.SERVER_PORT || 3000;

// [Base de datos] - MongoDB
const dbConnection = require('./database/config');
dbConnection();

// [Configuraciones]
app.use(require('cors')());
app.use(express.json());
app.use(express.static('public'));

// [Rutas]
app.get('/', (req, res) => res.json({welcome: 'Bienvenidos a Equinoccio Technology'}));
app.use('/api/alarma', require('./routes/alarma.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));

// [MQTT]
const mqttConnect = require('./mqtt/mqttConnect');
mqttConnect(server);

// [Ejecucion de servidor]
server.listen(server_port, () => {
    console.log(chalk.blue('[Desarrollador]') + ' - Equinoccio Technology');    
    console.log(chalk.blue('[Express]') + ` - Servidor corriendo en http://localhost:${server_port}`);
});