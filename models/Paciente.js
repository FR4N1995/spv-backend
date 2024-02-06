import mongoose from 'mongoose';
 

const pacientesSchems = mongoose.Schema({

    nombre:{
        type: String,
        required: true,
    },
    propietario:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas:{
        type: String,
        required: true,
    },
    // relacionar una tabla con su id
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinario",
    },
   
},
{
    // para que ponga columnas de editar y eliminar
    timestamps: true,
}
);

const Paciente = mongoose.model('Paciente', pacientesSchems);

export default Paciente;