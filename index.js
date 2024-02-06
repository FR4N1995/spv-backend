// version antigua
// const express = require('express');
//creando el servidor
import express from 'express';
//dependencia para las variables de entorno
import dotenv from 'dotenv';
// los cors son una forma de proteger una application, es donde especificas quienes pueden consumir la ap 
import cors from 'cors';
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinariosRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express();
// para que resiva datos de tipo json desde posman
app.use(express.json());
dotenv.config();
conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOption = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            // el origen del request esta permitido
            callback(null, true);
        }else{
            callback(new Error('No Permitido acceso'));
        }
    }
}

app.use(cors(corsOption));
app.use('/api/veterinarios', veterinarioRoutes );
app.use('/api/pacientes', pacienteRoutes );

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>{
    console.log(`servidor funcionando en el puerto ${PORT}`)
})