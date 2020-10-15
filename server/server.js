require("./config/config");

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuracion global de Rutas:
app.use(require('./routes/index'));

// // Conexion a base de datos local
// mongoose.connect('mongodb://localhost:27017/cafe', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

// Conexion a mongo atlas:
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Conectado a la BD');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}`);
});