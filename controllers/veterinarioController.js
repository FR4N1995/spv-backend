import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) =>{
    // console.log(req.body);
     const {nombre, password, email} = req.body;
    // console.log(nombre);

    //prevenir usuarios repetidos
    const existeUsuario = await Veterinario.findOne({email: email});
    if (existeUsuario) {
        const error = new Error("Usuario ya Registrado");
        return res.status(400).json({msg: error.message});
    }

    try {
        // guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
  

    
}

const perfil = (req, res) =>{
    const {veterinario} = req
    res.json(veterinario);
};


const confirmar = async(req, res) =>{
    // console.log(req.params.token);

    const {token} = req.params;
    const usuarioConfirmado = await Veterinario.findOne({token: token});

    if(!usuarioConfirmado){     
        const error = new Error("Token no valido");
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioConfirmado.token = null;
        usuarioConfirmado.confirmado = true;
        await usuarioConfirmado.save();
        res.json({msg: "Usuario confirmado correctamente"});
    } catch (error) {
        
    } 
}

const autenticar = async(req, res) =>{
    // console.log(req.body);
    const {email, password} = req.body;
    // comprobar que el usuario exista
    const usuario = await Veterinario.findOne({email: email});

    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message});
    }

    // comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta No esta autenticada');
        return res.status(404).json({msg: error.message});
    }

    // Revisar que la contraseña es correcta
    if(await usuario.comprobarPassword(password)){
        // console.log('password correcto');

        //autenticar
        usuario.token = 
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            web: usuario.web,
            token:  generarJWT(usuario.id),
        });

    }else{
        console.log('password incorrecto');
        const error = new Error('Password Incorrecto');
        return res.status(404).json({msg: error.message});
    }

}

const olvidePassword = async(req, res) =>{
    const {email} = req.body;
    // console.log(email);

    const existeVeterinario = await Veterinario.findOne({email: email});
    if(!existeVeterinario){
        const error = new Error("El usuario no Existe");
        return res.status(400).json({msg: error.message});
    }
    //si exsite el usuario generar el Token
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save()
        // Enviar Email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })
        res.json({msg: "hemos enviado las instrucciones a su correo"})
    } catch (error) {
        console.log(error);
    }

}
const comprobarToken = async(req, res) =>{
    const {token} = req.params
     console.log(token);

    const tokenValido = await Veterinario.findOne({token: token});

    if(tokenValido){
        // el Token es valido el usuuario Existe
        res.json({msg: "Token Valido el usuario Existe"});
    }else{
        const error = new Error('Token no valido');
        return res.status(400).json({msg: error.message});
    }


}
const nuevoPassword = async(req, res) =>{

    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error('El correo no se encuentra registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save()
        res.json({msg: "Password modificado Correctamente"});
        
    } catch (error) {
        console.log(error);
    }

}

const actualizarPerfil = async (req, res) => {
    // console.log(req.params.id);
    // console.log(req.body);
    const veterinario = await Veterinario.findById(req.params.id);

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }
    const {email} = req.body;
    if(veterinario.email !== req.body.email){
        const exiteEmail = await Veterinario.findOne({email});
        if(exiteEmail){
            const error = new Error('El email Ya esta en uso');
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre;
        veterinario.email = req.body.email || veterinario.email;
        veterinario.web = req.body.web || veterinario.web;
        veterinario.telefono = req.body.telefono || veterinario.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
        
    } catch (error) {
        console.log(error);
        
    }

}

const actualizarPassword = async (req, res) =>{
    // console.log(req.veterinario);
    // console.log(req.body);
    // leer los datos
    const {id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body
    // comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }
    // comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
         // almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: 'Password Almacenado Correctamente'});
    }else{
        const error = new Error('El password Actual es Incorrecto');
        return res.status(400).json({msg: error.message});
    }

   

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    actualizarPassword,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil
};