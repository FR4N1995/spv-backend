import Paciente from "../models/Paciente.js"


const agregarPaciente = async(req, res) =>{
    // console.log(req.body);
    const paciente = new Paciente(req.body);
    // console.log(req.veterinario._id);
    paciente.veterinario = req.veterinario._id;
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
        
    }
}
const obtenerPacientes = async(req, res) =>{
    const pacientes = await Paciente.find()

    res.json(pacientes);

}
const obtenerPaciente = async(req, res)  =>{
    // console.log(req.params.id);
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    // verificamos que el paciente exista
    if(!paciente){
        return res.status(404).json({msg: "No Encontrado"});
    }
    // vereficar que el veterinario es quien lo agrrego
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res({msg: "Accion No valia"});
    }

    if(paciente){
        res.json({paciente});
    }

    // console.log(paciente);
}

const actualizarPaciente = async (req, res) =>{
    // console.log(req.params.id);
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    // verificamos que el paciente exista
    if(!paciente){
        return res.status(404).json({msg: "No Encontrado"});
    }
    // vereficar que el veterinario es quien lo agrrego y que no sea otro veterinario
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res({msg: "Accion No valia"});
    }
    // Actualizar Veterinario
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    

    try {
        const pacienteActualizado = await paciente.save();
        res.json({pacienteActualizado});
    } catch (error) {
        res.json({msg: "Error"});
    }
}

const eliminarPaciente = async (req, res) =>{
        // console.log(req.params.id);
        const {id} = req.params;
        const paciente = await Paciente.findById(id);
        // verificamos que el paciente exista
        if(!paciente){
            return res.status(404).json({msg: "No Encontrado"});
        }
        // vereficar que el veterinario es quien lo agrrego y que no sea otro veterinario
        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
            return res({msg: "Accion No valia"});
        }

        try {
            await paciente.deleteOne()
            res.json({msg: "Paciente Eliminado"});
        } catch (error) {
            console.log(error);
            
        }

}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}