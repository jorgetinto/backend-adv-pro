require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// crear el servidor de express
const app = express();

//configurar CORS
app.use(cors());

// base de datos
dbConnection();

// Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola Mundo'
    });
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto' + process.env.PORT);
})